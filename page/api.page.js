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
    const urlPattern = /^(https?:\/\/|\/)/; // Valida URLs absolutas y relativas
    return urlPattern.test(url);
  }

  validateRelatedTopicsStructure(data) {
    return data.RelatedTopics.every((topic) => {
      // Validar que cada `RelatedTopic` tenga un `FirstURL` válido (si existe)
      if (topic.FirstURL && !this.isValidURL(topic.FirstURL)) {
        return false;
      }

      // Validar que los subtemas (si existen) también cumplan con la estructura
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
