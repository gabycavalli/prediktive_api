const DuckDuckGoAPI = require('../page/api.page');
import { API_CONFIG } from '../config';

describe('DuckDuckGo API Tests', () => {
  let duckDuckGoAPI;
  let responseData;

  beforeAll(async () => {
    duckDuckGoAPI = new DuckDuckGoAPI(API_CONFIG.url);
    responseData = await duckDuckGoAPI.getSearchResults(API_CONFIG.query);
  });

  test('Validar y contar Icon URLs válidos', () => {
    const iconCount = duckDuckGoAPI.countIconURLs(responseData);

    console.log(`Total Icon URLs válidos encontrados: ${iconCount}`);
    expect(iconCount).toBeGreaterThan(0); // Aseguramos que haya al menos un Icon URL válido
  });

  test('Validar que los RelatedTopics tengan una estructura válida', () => {
    const isValidStructure =
      duckDuckGoAPI.validateRelatedTopicsStructure(responseData);

    console.log(
      `La estructura de RelatedTopics es válida: ${isValidStructure}`
    );
    expect(isValidStructure).toBe(true);
  });
  test('Validar que todos los Icon URLs tengan un formato válido', () => {
    responseData.RelatedTopics.forEach((topic) => {
      if (topic.Icon?.URL) {
        expect(duckDuckGoAPI.isValidURL(topic.Icon.URL)).toBe(true);
      }

      if (topic.Topics) {
        topic.Topics.forEach((subTopic) => {
          if (subTopic.Icon?.URL) {
            expect(duckDuckGoAPI.isValidURL(subTopic.Icon.URL)).toBe(true);
          }
        });
      }
    });

    console.log('Todos los Icon URLs tienen un formato válido.');
  });
});
