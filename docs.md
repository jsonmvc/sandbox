
entities:
  session: Holds information about events and data that occur during the interaction between the user and the entities
  list: The entities list - this is synced with the database
  action: Section for updating/creating an entity
    session: Holds information related to the current entity being updated/created
    data:
      [category]:
        [field]:
          value: The current value entered by the user/system
          error: The value is validated on input
    errors: List with all the errors currently present on data
  fields: Used for creating inputs
  table: Used for order listing
