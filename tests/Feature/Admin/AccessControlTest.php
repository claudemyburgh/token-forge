<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Enums\RolesEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AccessControlTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed');
    }

    public function test_super_admin_can_access_access_control_page()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::SUPER_ADMIN->value);

        $response = $this->actingAs($user)->get(route('admin.access-control'));

        $response->assertStatus(200);
    }

    public function test_non_super_admin_cannot_access_access_control_page()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::ADMIN->value);

        $response = $this->actingAs($user)->get(route('admin.access-control'));

        $response->assertStatus(403);
    }

    public function test_super_admin_can_create_role()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::SUPER_ADMIN->value);

        $response = $this->actingAs($user)->post(route('admin.roles.store'), [
            'name' => 'New Role',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('roles', ['name' => 'New Role']);
    }

    public function test_super_admin_can_create_permission()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::SUPER_ADMIN->value);

        $response = $this->actingAs($user)->post(route('admin.permissions.store'), [
            'name' => 'new-permission',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('permissions', ['name' => 'new-permission']);
    }

    public function test_super_admin_can_assign_role_to_user()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::SUPER_ADMIN->value);

        $userToAssign = User::factory()->create();
        $roleToAssign = Role::where('name', RolesEnum::ADMIN->value)->first();

        $response = $this->actingAs($user)->post(route('admin.assign-role.store'), [
            'user_id' => $userToAssign->id,
            'role_name' => $roleToAssign->name,
        ]);

        $response->assertRedirect();
        $this->assertTrue($userToAssign->hasRole($roleToAssign->name));
    }
}
