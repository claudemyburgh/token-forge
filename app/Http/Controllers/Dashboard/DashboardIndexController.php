<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;

class DashboardIndexController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return ['auth', 'verified'];
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return Inertia::render('dashboard');
    }
}
