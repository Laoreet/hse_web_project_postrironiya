interface ApiKey {
    SERVICE_ID: string;
    TEMPLATE_ID: string;
    PUBLIC_KEY: string;
  }
  
  const apiKey: ApiKey = {
    SERVICE_ID: 'service_6zi41dw',
    TEMPLATE_ID: 'template_gv1vuvq',
    PUBLIC_KEY: 'OSXhQJTg46Nwzgf8g',
  };

  const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  };
  
  export default apiKey;