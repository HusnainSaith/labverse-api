// src/modules/auth/decorators/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// Adjust these paths if your User or EmployeeProfile entities are located differently
import { User } from 'src/modules/users/entities/user.entity';
import { EmployeeProfile } from '../../hr/employees/entities/employee.entity'; 


export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | EmployeeProfile => {
    const request = ctx.switchToHttp().getRequest();

    
    if (!request.user) {
     
      throw new Error('No user found in request. Ensure JwtAuthGuard is applied and successful.');
    }

    
    if (typeof data === 'string') {
     
      return request.user[data as keyof (User | EmployeeProfile)];
    }


    return request.user;
  },
);