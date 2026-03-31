<?php

require __DIR__ . '/vendor/autoload.php';

use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Exceptions\MPApiException;

MercadoPagoConfig::setAccessToken('TEST-6649937066798182-032621-d3d053ff95cb1e6a63345c02e0024a3b-432862257');
MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);

try {
    $client = new PreferenceClient();
    $preference = $client->create([
        'items' => [
            [
                'title' => 'Rack de Servidor',
                'quantity' => 1,
                'unit_price' => 85000.0,
                'currency_id' => 'CLP',
            ],
        ],
        'back_urls' => [
            'success' => 'http://localhost:8000/payment/success/1',
            'failure' => 'http://localhost:8000/payment/failure/1',
            'pending' => 'http://localhost:8000/payment/pending/1',
        ],
        'external_reference' => 'TEST-ORDER-001',
        'payer' => [
            'first_name' => 'Carlos',
            'last_name' => 'Test',
            'email' => 'test_user_buyer@testuser.com',
        ],
    ]);

    echo "SUCCESS!\n";
    echo "Preference ID: " . $preference->id . "\n";
    echo "Sandbox URL: " . $preference->sandbox_init_point . "\n";

} catch (MPApiException $e) {
    echo "MPApiException caught!\n";
    echo "Status code: " . $e->getStatusCode() . "\n";
    $content = $e->getApiResponse()->getContent();
    echo "Response: " . json_encode($content, JSON_PRETTY_PRINT) . "\n";
} catch (\Exception $e) {
    echo "Exception: " . get_class($e) . "\n";
    echo "Message: " . $e->getMessage() . "\n";
}
