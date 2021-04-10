package fr.polytech.info4.service.mapper;


import fr.polytech.info4.domain.*;
import fr.polytech.info4.service.dto.CompteDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Compte} and its DTO {@link CompteDTO}.
 */
@Mapper(componentModel = "spring", uses = {RolesMapper.class})
public interface CompteMapper extends EntityMapper<CompteDTO, Compte> {

    @Mapping(source = "roles.id", target = "rolesId")
    CompteDTO toDto(Compte compte);

    @Mapping(target = "courses", ignore = true)
    @Mapping(target = "removeCourse", ignore = true)
    @Mapping(target = "paniers", ignore = true)
    @Mapping(target = "removePanier", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(source = "rolesId", target = "roles")
    @Mapping(target = "systemePaiements", ignore = true)
    @Mapping(target = "removeSystemePaiement", ignore = true)
    Compte toEntity(CompteDTO compteDTO);

    default Compte fromId(Long id) {
        if (id == null) {
            return null;
        }
        Compte compte = new Compte();
        compte.setId(id);
        return compte;
    }
}
