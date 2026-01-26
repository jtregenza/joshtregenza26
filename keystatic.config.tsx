import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        date: fields.date({ label: 'Date' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value,
          }
        ),
        liveUrl: fields.url({
          label: 'Live URL',
          validation: { isRequired: false },
        }),
        githubUrl: fields.url({
          label: 'GitHub URL',
          validation: { isRequired: false },
        }),
        videoUrl: fields.url({
          label: 'Video URL (YouTube/Vimeo)',
          validation: { isRequired: false },
        }),
        audioUrl: fields.url({
          label: 'Audio URL',
          validation: { isRequired: false },
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/projects',
            publicPath: '/images/projects/',
          },
        }),
      },
    }),
    musings: collection({
      label: 'Musings',
      slugField: 'title',
      path: 'content/musings/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        excerpt: fields.text({
          label: 'Excerpt',
          multiline: true,
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/musings',
          publicPath: '/images/musings/',
          validation: { isRequired: false },
        }),
        publishedDate: fields.date({ label: 'Published Date' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value,
          }
        ),
        audioUrl: fields.url({
          label: 'Audio URL (for podcast-style musings)',
          validation: { isRequired: false },
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/musings',
            publicPath: '/images/musings/',
          },
        }),
      },
    }),
  },
});