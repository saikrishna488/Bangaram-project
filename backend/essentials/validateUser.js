import axios from 'axios'


const validateUser = async (chat_id,user_id) => {
    const url = `https://api.telegram.org/bot7468849881:AAEi2X1dfsufC5vtAldslqu52AAr_DPcFMY/getChatMember`;
    
    try {
      const response = await axios.get(url, {
        params: {
          chat_id : chat_id,  // Correct chat_id format with @username
          user_id: user_id // The Telegram user ID of the person
        }
      });
  
      const { status } = response.data.result;

      console.log(status)
      if (['member', 'administrator', 'creator'].includes(status)) {
        return true
      } else {
        return false
      }
    } catch (error) {
    //   console.error('Error checking Telegram membership:', error.response?.data || error.message);
      return false;
    }
  };
  
export default validateUser;
  