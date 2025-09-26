<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route.get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::delete('admin/users', [UserController::class, 'destroy'])->name('admin.users.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
