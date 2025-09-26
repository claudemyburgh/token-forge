<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\delete;

it('allows authenticated users to view the admin users page', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('admin.users.index'))
        ->assertOk();
});

it('passes correct users to the view', function () {
    $user = User::factory()->create();
    User::factory()->count(5)->create();

    actingAs($user)
        ->get(route('admin.users.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->has('users', 6)
        );
});

it('allows authenticated users to delete users', function () {
    $user = User::factory()->create();
    $usersToDelete = User::factory()->count(3)->create();
    $idsToDelete = $usersToDelete->pluck('id')->toArray();

    actingAs($user)
        ->delete(route('admin.users.destroy'), ['ids' => $idsToDelete])
        ->assertRedirect();

    foreach ($usersToDelete as $deletedUser) {
        $this->assertDatabaseMissing('users', ['id' => $deletedUser->id]);
    }
});