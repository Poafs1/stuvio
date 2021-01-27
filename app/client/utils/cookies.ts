import Cookies from 'js-cookie'

export class CookieClass {
  
  // Create cookie manually
  private create(name: string, value: string, days: number) {
    let expires: string;
    if (days) {
        let date: Date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date['toUTCString']();
    }
    else {
        expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
  }

  // Create cookie manually
  createCookie(name: string, value: string, days: number) {
    this.create(name, value, days)
  }

  // Read cookie manually
  readCookie(name: string) {
    let nameEQ: string = name + "=";
    let ca: string[] = document.cookie.split(';');
    for(let i: number=0;i < ca.length;i++) {
      let c: string = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
      }
    }
    return null;
  }

  // Delete cookie manually
  eraseCookie(name: string) {
    this.create(name, "", -1)
  }

  // Delete cookie with js-cookie
  deleteCookie = (redirect: string='/') => {
    Object.keys(Cookies.get()).forEach(cookieName => {
      Cookies.remove(cookieName)
    })
    this.eraseCookie('rftoken')
    window.location.href = redirect
  }
}