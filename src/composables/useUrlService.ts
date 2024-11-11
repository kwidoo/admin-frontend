import CustomerUrls from '@/types/CustomerUrls';
import ContactUrls from '@/types/ContactUrls';
import LoginUrls from '@/types/LoginUrls';


const urlService = () => {
    return {
        customer: new CustomerUrls(),
        login: new LoginUrls(),
        contact: new ContactUrls(),

    };

};

export default urlService;
