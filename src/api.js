// import OpenAI from 'openai';

export default {
	id: 'openai-auto-translate',
	handler: ({ item_id, collection, translation_table, language_table }, { env, services, getSchema }) => {
		const OpenAIService = require('openai');

		if(env.OPENAI_API_KEY == undefined) return "API Key not defined";
		if(env.OPENAI_RATE_LIMIT == undefined) return "API Key not defined";

		const openai = new OpenAIService({
			apiKey: env.OPENAI_API_KEY
		});

		const output = [];
		const errors = [];

		const { ItemsService } = services;
		const schema = getSchema();
		const translations = new ItemsService(translation_table, { schema: schema });
		const languages = new ItemsService(language_table, { schema: schema });

		translations.readByQuery({ fields: ['*'], filter: { [`${collection}_id`]: { _eq: item_id }}}).then((items) => {

			if(items[0] == undefined) return 'No initial sample found.';

			languages.readByQuery({ fields: ['code','name'], filter: { code: { _neq: items[0].languages_id } } }).then((langs) => {
				
				let translation_item = items[0];
				delete translation_item['id'];

				const json_sample = translation_item;

				if(langs.length === 0) return 'No languages found in table.';

				for (let i = 0; i < langs.length; i++) {
					openapi_call(i, langs[i], json_sample);
				};

				delay(langs.length * env.OPENAI_RATE_LIMIT).then(() => {
					console.log(output);
					console.log(errors);
					if(errors.length > 0) return errors;
					return output;
				});

			});
		});

		function openapi_call(i, lang, json_sample){
			delay(i * env.OPENAI_RATE_LIMIT).then(() => {
				openai.chat.completions.create({
					messages: [{ role: 'user', content: 'Translate the following JSON into '+lang.name+' '+JSON.stringify(json_sample) }],
					model: 'gpt-3.5-turbo',
				}).then((openai_response) => {
					//console.log(openai_response);
					if(openai_response == undefined) return;
					let translated_data = JSON.parse(openai_response.choices[0].message.content.replace("\\\"","\""));
					translated_data.languages_id = lang.code;
					//console.log(translated_data);
					translations.createOne(translated_data).then((create_response) => {
						//console.log(create_response);
						output.push(create_response);
						return;
					}).catch((error) => {
						console.log(error);
						errors.push(error);
						return;
					});
				}).catch((error) => {
					console.log(error);
					errors.push(error);
					return;
				});
			});
		}

		function delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	},
};
