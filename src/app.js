export default {
	id: 'openai-auto-translate',
	name: 'OpenAI Auto Translate',
	icon: 'translate',
	description: 'Use OpenAI language models to automatically translate your fields!',
	overview: ({ collection }) => [
		{
			label: '$t:collection',
			text: collection,
		},
	],
	options: [
		{
			field: 'item_id',
			name: 'Item ID',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
			},
		},
		{
			field: 'collection',
			name: '$t:collection',
			type: 'string',
			meta: {
				interface: 'system-collection',
				options: {
					includeSystem: true,
					includeSingleton: false,
				},
				width: 'half',
			},
		},
		{
			field: 'translation_table',
			name: 'Translation Table',
			type: 'string',
			meta: {
				interface: 'system-collection',
				options: {
					includeSystem: true,
					includeSingleton: false,
				},
				width: 'half',
			},
		},
		{
			field: 'language_table',
			name: 'Languages Table',
			type: 'string',
			meta: {
				interface: 'system-collection',
				options: {
					includeSystem: true,
					includeSingleton: false,
				},
				width: 'half',
			},
		},

	],
};
