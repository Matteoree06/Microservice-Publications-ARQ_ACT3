<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\AuthorRepository;
use App\Repositories\EloquentAuthorRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // REPOSITORY PATTERN - Bind interface to implementation
        $this->app->bind(AuthorRepository::class, EloquentAuthorRepository::class);
        
        // Register Author Service as singleton for better performance
        $this->app->singleton(\App\Services\AuthorService::class, function ($app) {
            return new \App\Services\AuthorService(
                $app->make(AuthorRepository::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
