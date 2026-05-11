export default {
  name: 'room',
  title: 'Rooms',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Room Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    },
    {
      name: 'price',
      title: 'Room Price',
      type: 'number',
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
    },
    {
      name: 'fullDescription',
      title: 'Full Description',
      type: 'text',
    },
    {
      name: 'amenities',
      title: 'Amenities List',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'occupancy',
      title: 'Occupancy Info',
      type: 'string',
    },
    {
      name: 'stayType',
      title: 'Stay Type Labels',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'highlights',
      title: 'Room Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'coverImage',
      title: 'Room Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'gallery',
      title: 'Room Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'availabilityText',
      title: 'Availability Text',
      type: 'string',
    },
    {
      name: 'pricingNotes',
      title: 'Pricing Notes',
      type: 'text',
    },
    {
      name: 'featured',
      title: 'Featured Flag',
      type: 'boolean',
    },
  ],
}
