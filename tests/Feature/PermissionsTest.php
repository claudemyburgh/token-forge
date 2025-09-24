<?php

namespace Tests\Feature;

use App\Models\User;
use App\Enums\RolesEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class PermissionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles and permissions
        $this->artisan('db:seed');
    }

    public function test_user_with_access_settings_permission_can_access_settings_page()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::ADMIN->value);

        $response = $this->actingAs($user)->get(route('profile.edit'));

        $response->assertStatus(200);
    }

    public function test_user_without_access_settings_permission_cannot_access_settings_page()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::FREE->value);

        $response = $this->actingAs($user)->get(route('profile.edit'));

        $response->assertStatus(403);
    }

    public function test_settings_link_is_visible_for_user_with_permission()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::ADMIN->value);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('auth.permissions', fn ($permissions) => in_array('access-settings', $permissions))
        );
    }

    public function test_settings_link_is_hidden_for_user_without_permission()
    {
        $user = User::factory()->create();
        $user->assignRole(RolesEnum::FREE->value);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('auth.permissions', fn ($permissions) => !in_array('access-settings', $permissions))
        );
    }
}
