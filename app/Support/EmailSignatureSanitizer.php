<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

final class EmailSignatureSanitizer
{
    private const ALLOWED_TAGS = [
        'a', 'b', 'br', 'div', 'em', 'i', 'img', 'li', 'ol', 'p', 'span',
        'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul',
    ];

    private const REMOVE_WITH_CONTENT = [
        'base', 'embed', 'form', 'frame', 'iframe', 'input', 'link', 'meta',
        'object', 'script', 'style', 'svg', 'template', 'video',
    ];

    private const STYLE_PROPERTIES = [
        'background-color', 'color', 'font-family', 'font-size', 'font-style',
        'font-weight', 'line-height', 'margin', 'margin-bottom', 'margin-left',
        'margin-right', 'margin-top', 'padding', 'padding-bottom', 'padding-left',
        'padding-right', 'padding-top', 'text-align', 'text-decoration',
    ];

    public static function sanitize(?string $html): ?string
    {
        $html = trim((string) $html);

        if ($html === '') {
            return null;
        }

        $previous = libxml_use_internal_errors(true);
        $document = new DOMDocument('1.0', 'UTF-8');
        $document->loadHTML(
            '<!DOCTYPE html><html><body><div id="signature-root">'.$html.'</div></body></html>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET,
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $document->getElementById('signature-root');
        if (! $root instanceof DOMElement) {
            return null;
        }

        self::sanitizeChildren($root);

        $result = '';
        foreach (iterator_to_array($root->childNodes) as $child) {
            $result .= $document->saveHTML($child);
        }

        return trim($result) ?: null;
    }

    public static function toPlainText(?string $html): ?string
    {
        $sanitized = self::sanitize($html);
        if (! $sanitized) {
            return null;
        }

        $text = html_entity_decode(strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $sanitized)), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace("/\n{3,}/", "\n\n", trim($text));

        return $text !== '' ? $text : null;
    }

    private static function sanitizeChildren(DOMNode $parent): void
    {
        foreach (iterator_to_array($parent->childNodes) as $node) {
            if ($node instanceof DOMElement) {
                self::sanitizeChildren($node);
                self::sanitizeElement($node);
            }
        }
    }

    private static function sanitizeElement(DOMElement $element): void
    {
        $tag = strtolower($element->tagName);

        if (in_array($tag, self::REMOVE_WITH_CONTENT, true)) {
            $element->parentNode?->removeChild($element);

            return;
        }

        if (! in_array($tag, self::ALLOWED_TAGS, true)) {
            self::unwrap($element);

            return;
        }

        foreach (iterator_to_array($element->attributes) as $attribute) {
            $name = strtolower($attribute->name);
            $value = trim($attribute->value);

            if (! self::attributeIsAllowed($tag, $name)) {
                $element->removeAttributeNode($attribute);

                continue;
            }

            if ($name === 'href' && ! self::safeUrl($value, false)) {
                $element->removeAttributeNode($attribute);

                continue;
            }

            if ($name === 'src' && ! self::safeUrl($value, true)) {
                $element->removeAttributeNode($attribute);

                continue;
            }

            if (in_array($name, ['height', 'width'], true) && ! preg_match('/^\d{1,4}$/', $value)) {
                $element->removeAttributeNode($attribute);

                continue;
            }

            if ($name === 'style') {
                $style = self::sanitizeStyle($value);
                if ($style === '') {
                    $element->removeAttributeNode($attribute);
                } else {
                    $element->setAttribute('style', $style);
                }
            }
        }

        if ($tag === 'a' && $element->hasAttribute('href')) {
            $element->setAttribute('rel', 'noopener noreferrer');
        }
    }

    private static function attributeIsAllowed(string $tag, string $attribute): bool
    {
        $allowed = [
            'a' => ['href', 'style', 'title'],
            'img' => ['alt', 'height', 'src', 'style', 'width'],
            'table' => ['cellpadding', 'cellspacing', 'style', 'width'],
            'td' => ['align', 'colspan', 'rowspan', 'style', 'width'],
            'th' => ['align', 'colspan', 'rowspan', 'style', 'width'],
        ];

        return in_array($attribute, $allowed[$tag] ?? ['style'], true);
    }

    private static function safeUrl(string $value, bool $image): bool
    {
        $parts = parse_url($value);
        $scheme = strtolower((string) ($parts['scheme'] ?? ''));

        if ($image) {
            return $scheme === 'https';
        }

        return in_array($scheme, ['https', 'http', 'mailto', 'tel'], true);
    }

    private static function sanitizeStyle(string $value): string
    {
        $styles = [];

        foreach (explode(';', $value) as $declaration) {
            [$property, $styleValue] = array_pad(explode(':', $declaration, 2), 2, '');
            $property = strtolower(trim($property));
            $styleValue = trim($styleValue);

            if (! in_array($property, self::STYLE_PROPERTIES, true)
                || $styleValue === ''
                || preg_match('/(?:url|expression|@import|javascript|behavior)/i', $styleValue)
                || ! preg_match('/^[a-zA-Z0-9#%(),.\s\-\/' . "'\"" . ']+$/', $styleValue)) {
                continue;
            }

            $styles[] = $property.': '.$styleValue;
        }

        return implode('; ', $styles);
    }

    private static function unwrap(DOMElement $element): void
    {
        $parent = $element->parentNode;
        if (! $parent) {
            return;
        }

        while ($element->firstChild) {
            $parent->insertBefore($element->firstChild, $element);
        }

        $parent->removeChild($element);
    }
}
