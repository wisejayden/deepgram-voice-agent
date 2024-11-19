export class DriveThruService {
  constructor(baseURL = process.env.NEXT_PUBLIC_DRIVE_THRU_API_URL, headers = {}) {
    this.url = baseURL;
    this.headers = headers;
  }

  async deleteMenu() {
    const response = await fetch(`${this.url}/menu/items`, {
      method: "DELETE",
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error("Failed to delete menu items");
    }
    return response;
  }

  async addToMenu(item) {
    const response = await fetch(`${this.url}/menu/items`, {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to add menu item");
    }
    return response;
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
    return menuJSON?.items;
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
    return orderJSON?.items;
  }
}
