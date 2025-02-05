const DuckDuckGoAPI = require('../page/api.page');
import { API_CONFIG } from '../config';

describe('DuckDuckGo API Tests', () => {
  let duckDuckGoAPI;
  let responseData;

  beforeAll(async () => {
    duckDuckGoAPI = new DuckDuckGoAPI(API_CONFIG.url);
    responseData = await duckDuckGoAPI.getSearchResults(API_CONFIG.query);
  });

  /* test('Validate that RelatedTopics have a valid structure', () => { --> // to another instance
    const isValidStructure =
      duckDuckGoAPI.validateRelatedTopicsStructure(responseData);

    console.log(`The RelatedTopics structure is valid: ${isValidStructure}`);
    expect(isValidStructure).toBe(true);
  }); */

  test('Should print out values of Icon URLs if it is not null', () => {
    const validateAndPrintIconURLs = (topics) => {
      topics.forEach((topic) => {
        if (topic.Icon?.URL) {
          console.log(JSON.stringify({ IconURL: topic.Icon.URL }));
          expect(duckDuckGoAPI.isValidURL(topic.Icon.URL)).toBe(true);
        }

        if (Array.isArray(topic.Topics)) {
          validateAndPrintIconURLs(topic.Topics);
        }
      });
    };

    validateAndPrintIconURLs(responseData.RelatedTopics);
  });

  test('Should validate and count valid Icon URL', () => {
    const iconCount = duckDuckGoAPI.countIconURLs(responseData);

    console.log(`Total valid Icon URLs found: ${iconCount}`);
    expect(iconCount).toBeGreaterThan(0); // Make sure that at least one Icon URL is valid
  });
});
