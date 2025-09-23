<?php

namespace App\Enums;

enum RolesEnum: string
{
    case SUPER_ADMIN = 'Super Admin';
    case ADMIN = 'Admin';
    case PRO = 'Pro';
    case FREE = 'Free';


    public static function values(): array
    {
        return array_map(fn(self $role) => $role->value, self::cases());
    }
}
