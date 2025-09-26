<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        foreach (RolesEnum::values() as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }


        $user = User::firstOrCreate(
            ['email' => 'claude@designbycode.co.za'],
            [
                'name' => 'Claude Myburgh',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $user->assignRole('Super Admin');

        $this->call([
            UserSeeder::class
        ]);
    }


}
