import CustomerUrls from '@/types/CustomerUrls';
import ContactUrls from '@/types/ContactUrls';


const urlService = () => {
    return {
        customer: new CustomerUrls(),
        contact: new ContactUrls(),
    };

};

export default urlService;
