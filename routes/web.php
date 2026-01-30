<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/guide');

Route::get('/guide', function () {
    return Inertia::render('Guide');
})->name('guide');

Route::get('/api-reference', function () {
    return Inertia::render('ApiReference');
})->name('api-reference');

Route::get('/examples', function () {
    return Inertia::render('Examples');
})->name('examples');
