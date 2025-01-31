const axios = require('axios');
import { API_CONFIG } from '../config';
class DuckDuckGoAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getSearchResults(query, format = API_CONFIG.format) {
    const url = `${this.baseURL}?q=${query}&format=${format}`;
    const response = await axios.get(url);
    console.log(url);
    return response.data;
  }

  countIconURLs(data) {
    let iconCount = 0;

    data.RelatedTopics.forEach((topic) => {
      if (this.isValidURL(topic.Icon?.URL)) {
        iconCount++;
      }

      if (topic.Topics) {
        topic.Topics.forEach((subTopic) => {
          if (this.isValidURL(subTopic.Icon?.URL)) {
            iconCount++;
          }
        });
      }
    });

    return iconCount;
  }

  isValidURL(url) {
    if (!url) return false;
    const urlPattern = /^(https?:\/\/|\/)/; // Validate URLs absolutes and relatives
    return urlPattern.test(url);
  }

  validateRelatedTopicsStructure(data) {
    return data.RelatedTopics.every((topic) => {
      // Validate each `RelatedTopic` has a  `FirstURL` valid (if exists)
      if (topic.FirstURL && !this.isValidURL(topic.FirstURL)) {
        return false;
      }

      // Validate the structure of subtopics (if exists)
      if (topic.Topics) {
        return topic.Topics.every((subTopic) => {
          if (subTopic.FirstURL && !this.isValidURL(subTopic.FirstURL)) {
            return false;
          }
          return true;
        });
      }

      return true;
    });
  }
}

module.exports = DuckDuckGoAPI;
