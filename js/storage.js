class CookieJar {
  static set(key, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
  }

  static setJSON(key, obj, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = key + "=" + JSON.stringify(obj) + ";" + expires + ";path=/";
  }

  static get(key) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  static getJSON(key) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return JSON.parse(c.substring(name.length, c.length));
      }
    }
    return null;
  }

  static exists(key) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return true;
      }
    }
    return false;
  }
}

class SessionStorage {
  static set(key, value) {
    sessionStorage.setItem(key, value);
  }
  
  static setJSON(key, obj) {
    sessionStorage.setItem(key, JSON.stringify(obj));
  }

  static get(key) {
    return sessionStorage.getItem(key);
  }

  static getJSON(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  static exists(key) {
    const item = sessionStorage.getItem(key);
    if (!item) return false;
    return true;
  }
}

class LocalStorage {
  static set(key, value) {
    localStorage.setItem(key, value)
  }

  static setJSON(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj))
  }

  static get(key) {
    return localStorage.getItem(key);
  }

  static getJSON(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  static exists(key) {
    const item = localStorage.getItem(key);
    if (!item) return false;
    return true;
  }
}