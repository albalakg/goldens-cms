import * as jwt_decode from "jwt-decode";
import router from './../Router/router'

class Auth {
    save() {

    }

    logout() {
        
        router.push('/logout')
    }
    
    get() {
        if (this.isExpired)  {
            this.logout();
            return null;
        }
        else {
            const data = this.decode();
            return data;
        }
    }

    id() {
        return this.get() ? this.get().subject : null;
    }

    token() {
        return this.get() ? this.get().token : '';
    }

    name() {
        return this.get() ? this.get().name : '';
    }

    isAdmin() {
        return this.get() ? this.get().role === "admin" : false;
    }

    isNormal() {
        return this.get() ? this.get().role === "student" : false;
    }

    isGuest() {
        return !this.get();
    }

    isExpired() {
        return this.get() ? this.get.exp > Date.now() : true;
    }
    
    isLogged() {
        return !!this.get();
    }

    encrypt() {
        
    }

    decrypt() {
        
    }
}

export default new Auth;
