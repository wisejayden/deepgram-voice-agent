export class JitbService {
  constructor(baseURL = process.env.NEXT_PUBLIC_JITB_API_URL, headers = {}) {
    this.url = baseURL;
    this.headers = headers;
  }

  async getMenu() {
    const menu = await fetch(`${this.url}/menu`, {
      method: "GET",
      headers: this.headers,
    });
    if (!menu.ok) {
      throw new Error("Failed to fetch menu");
    }

    const menuJSON = await menu.json();
    return menuJSON;
  }

  async getCallID() {
    const callID = await fetch(`${this.url}/calls`, {
      method: "POST",
      headers: this.headers,
    });
    if (!callID.ok) {
      throw new Error("Failed to get call ID");
    }

    const callIDText = await callID.text();
    return callIDText;
  }

  async getOrder(callID) {
    const order = await fetch(`${this.url}/calls/${callID}/order`, {
      method: "GET",
      headers: this.headers,
    });
    if (!order.ok) {
      throw new Error("Failed to get order");
    }

    const orderJSON = await order.json();
    return orderJSON;
  }
}
