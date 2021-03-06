export interface CategoryDto {
    name: string;
    label: string;
    icon: string;
    entities: CategoryEntityDto[];
}

export interface CategoryEntityDto {
    name: string;
    label: string;
    selected: boolean;
    attrs: AttributeDto[];
}

export interface AttributeDto {
    name: string;
    selected: string;
}

export interface ActionDto {
    label: string;
}

