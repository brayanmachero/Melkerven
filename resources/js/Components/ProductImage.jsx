const CATALOG_REFERENCE_PNG = /\/images\/catalog-[^/?]+\.png(?=[?#]|$)/;

function variantSource(src, width, extension) {
    return src.replace(/\.png(?=[?#]|$)/, `-${width}.${extension}`);
}

export default function ProductImage({
    src,
    alt,
    className = '',
    loading = 'lazy',
    priority = false,
    sizes = '100vw',
}) {
    const isCatalogReference = CATALOG_REFERENCE_PNG.test(src || '');
    const image = (
        <img
            src={src}
            alt={alt}
            className={className}
            loading={priority ? 'eager' : loading}
            decoding="async"
            fetchPriority={priority ? 'high' : undefined}
            {...(isCatalogReference ? { width: 1672, height: 941 } : {})}
        />
    );

    if (!isCatalogReference) {
        return image;
    }

    const avifSources = [480, 960, 1440]
        .map((width) => `${variantSource(src, width, 'avif')} ${width}w`)
        .join(', ');
    const webpSources = [480, 960, 1440]
        .map((width) => `${variantSource(src, width, 'webp')} ${width}w`)
        .join(', ');

    return (
        <picture className="contents">
            <source type="image/avif" srcSet={avifSources} sizes={sizes} />
            <source type="image/webp" srcSet={webpSources} sizes={sizes} />
            {image}
        </picture>
    );
}
