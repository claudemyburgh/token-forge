<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accessSettings = Permission::firstOrCreate(['name' => 'access-settings']);

        $superAdminRole = Role::firstOrCreate(['name' => RolesEnum::SUPER_ADMIN->value]);
        $adminRole = Role::firstOrCreate(['name' => RolesEnum::ADMIN->value]);

        $superAdminRole->givePermissionTo($accessSettings);
        $adminRole->givePermissionTo($accessSettings);
    }
}
