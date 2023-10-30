#[derive(Model, Copy, Drop, Serde)]
struct Permission {
    #[key]
    app_name: felt252,
    can_update:  bool
}

#[derive(Print, Serde, Introspect)]
struct Methods {
  role_ids: Array<u8>
}


impl MethodsSchemaIntrospectionImpl for SchemaIntrospection<Methods> {
  #[inline(always)]
  fn size() -> usize {
    1 // Represents the byte size of the enum.
  }

  #[inline(always)]
  fn layout(ref layout: Array<u8>) {
    layout.append(8); // Specifies the layout byte size;
  }

  #[inline(always)]
  fn ty() -> Ty {
    Ty::Enum(
      Enum {
        name: 'Methods',
        attrs: array![].span(),
        children: array![
                    ('alert', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('app', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('color', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('owner', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('position', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('text', serialize_member_type(@Ty::Tuple(array![].span()))),
                    ('timestamp', serialize_member_type(@Ty::Tuple(array![].span()))),
                ]
          .span()
      }
    )
  }
}
