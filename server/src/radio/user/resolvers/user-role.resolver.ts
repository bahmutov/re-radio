import { ResolveProperty, Resolver, Root } from '@nestjs/graphql';
import { StationDTO } from 'radio/station/dto/station.dto';
import { UserRoleDTO } from '../dto/user-role.dto';
import { UserDTO } from '../dto/user.dto';
import { UserRoleService } from '../services/user-role.service';
import { UserService } from '../services/user.service';

@Resolver(of => UserRoleDTO)
export class UserRoleResolver {
  constructor(private readonly userService: UserService, private readonly userRoleService: UserRoleService) {}

  @ResolveProperty(returns => StationDTO)
  async station(@Root() userRole: UserRoleDTO) {
    const { station } = await this.userRoleService.findOneOrFail({
      where: { id: userRole.id },
      relations: ['station'],
    });
    return station;
  }

  @ResolveProperty(returns => UserDTO)
  async user(@Root() userRole: UserRoleDTO) {
    const { user } = await this.userRoleService.findOneOrFail({
      where: { id: userRole.id },
      relations: ['user'],
    });
    return user;
  }
}
