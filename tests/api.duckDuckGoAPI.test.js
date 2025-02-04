const DuckDuckGoAPI = require('../page/api.page');
import { API_CONFIG } from '../config';

describe('DuckDuckGo API Tests', () => {
  let duckDuckGoAPI;
  let responseData;

  beforeAll(async () => {
    duckDuckGoAPI = new DuckDuckGoAPI(API_CONFIG.url);
    responseData = await duckDuckGoAPI.getSearchResults(API_CONFIG.query);
  });

  test('Validate and count valid Icon URL', () => {
    const iconCount = duckDuckGoAPI.countIconURLs(responseData);

    console.log(`Total valid Icon URLs found: ${iconCount}`);
    expect(iconCount).toBeGreaterThan(0); // Make sure that at least one Icon URL is valid
  });

  test('Validate that RelatedTopics have a valid structure', () => {
    const isValidStructure =
      duckDuckGoAPI.validateRelatedTopicsStructure(responseData);

    console.log(`The RelatedTopics structure is valid: ${isValidStructure}`);
    expect(isValidStructure).toBe(true);
  });

  test('Validate and print all Icon URLs have valid formatting', () => {
    responseData.RelatedTopics.forEach((topic) => {
      if (topic.Icon?.URL) {
        console.log(`Icon URL: ${topic.Icon.URL}`);
        expect(duckDuckGoAPI.isValidURL(topic.Icon.URL)).toBe(true);
      }

      if (topic.Topics) {
        topic.Topics.forEach((subTopic) => {
          if (subTopic.Icon?.URL) {
            console.log(`SubTopic Icon URL: ${subTopic.Icon.URL}`);
            expect(duckDuckGoAPI.isValidURL(subTopic.Icon.URL)).toBe(true);
          }
        });
      }
    });

    console.log('All Icon URLs are in a valid format.');
  });
});
