// application/client-react/src/services/notaryService.js
import axios from 'axios';
axios.defaults.baseURL = "http://172.30.113.58:8001"; 
axios.defaults.withCredentials = true; 

const upsertOwnNotaryDetails = async (detailsData, username) => { // username 파라미터 추가
  try {
    const payload = {
      ...detailsData,
      requestingUsername: username // 백엔드로 보낼 username 추가
    };
    const response = await axios.put('/notary/details', payload);
    return response.data;
  } catch (error) {
    console.error('Error in upsertOwnNotaryDetails:', error.response?.data || error.message);
    throw error.response?.data || new Error(error.message || '공증인 정보 업데이트 중 오류가 발생했습니다.');
  }
};

const getOwnNotaryDetails = async (username) => { // username 파라미터 추가
  try {
    // username을 쿼리 파라미터로 전송
    const response = await axios.get('/notary/my-details', { params: { username } });
    return response.data; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn('getOwnNotaryDetails: Notary details not found (404).');
      return null; 
    }
    console.error('Error in getOwnNotaryDetails:', error.response?.data || error.message);
    throw error.response?.data || new Error(error.message || '저장된 공증인 정보를 가져오는 중 오류가 발생했습니다.');
  }
};
/**
 * 모든 활성 공증인 홍보 목록을 가져옵니다.
 * @returns {Promise<Array<object>>} 공증인 홍보 정보 객체 배열
 */
const getAllPublicNotaryPromotions = async () => {
    try {
      const response = await axios.get('/notary/promotions/list');
      return response.data;
    } catch (error) {
      console.error('Error in getAllPublicNotaryPromotions:', error.response?.data || error.message);
      throw error.response?.data || new Error(error.message || '공증인 목록을 가져오는 중 오류가 발생했습니다.');
    }
  };
export default {
  upsertOwnNotaryDetails,
  getOwnNotaryDetails,
  getAllPublicNotaryPromotions
};