export default {
  name: 'place',
  title: 'Discover Vadapalli',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Place Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'distance',
      title: 'Distance Info',
      type: 'string',
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'mapLink',
      title: 'Optional Map Link',
      type: 'url',
    },
  ],
}
