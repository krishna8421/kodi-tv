import React from "react";
import { DefaultLayout } from "../../components/Layout";
import { loadStripe } from "@stripe/stripe-js";
import ButtonStripe from "../../components/ButtonStripe";

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_APIKEY);

export default class PageStripe extends React.Component {
  constructor() {
    super();
    this.state = {
      otPrice: null,
      otCurrency: "price_1HVRC7DOVUu6yhjNHWNMz6Zf",
      otDonor: null,
      otForum: null,
      recCurrency: "USD",
      recDonor: null,
      recForum: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    var value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  render() {
    let frontmatter = {
      title: "Pay via Credit Card",
      breadcrumbs: "Donate | Stripe",
    };

    let level_one = {};
    let level_two = {};
    let level_three = {};
    let level_four = {};

    switch (this.state.recCurrency) {
      case "USD":
        level_one = {
          price: "price_1HVP1ODOVUu6yhjNAUMDRlrr",
          text: "$5 a month",
          amount: "5",
        };
        level_two = {
          price: "price_1HVP3mDOVUu6yhjNL7qjHUyW",
          text: "$10 a month",
          amount: "10",
        };
        level_three = {
          price: "price_1HVP3kDOVUu6yhjN7kaQEJ8L",
          text: "$25 a month",
          amount: "25",
        };
        level_four = {
          price: "price_1HVP3lDOVUu6yhjN1Z1gYPNf",
          text: "$50 a month",
          amount: "50",
        };
        break;
      case "EUR":
        level_one = {
          price: "price_1HVTTwDOVUu6yhjNVOWyY3hy",
          text: "€5 a month",
          amount: "5",
        };
        level_two = {
          price: "price_1HVTU9DOVUu6yhjNQjBxH8mv",
          text: "€10 a month",
          amount: "10",
        };
        level_three = {
          price: "price_1HVTULDOVUu6yhjNAMa8cdQg",
          text: "€20 a month",
          amount: "20",
        };
        level_four = {
          price: "price_1HVTUWDOVUu6yhjNmtcktSi7",
          text: "€40 a month",
          amount: "40",
        };
        break;
      case "GBP":
        level_one = {
          price: "price_1HVTUuDOVUu6yhjNJr8FS5hm",
          text: "£5 a month",
          amount: "5",
        };
        level_two = {
          price: "price_1HVTV4DOVUu6yhjNXZemCrK0",
          text: "£10 a month",
          amount: "10",
        };
        level_three = {
          price: "price_1HVTVEDOVUu6yhjNg0MVZShG",
          text: "£20 a month",
          amount: "20",
        };
        level_four = {
          price: "price_1HVTVTDOVUu6yhjNOpg1jIfU",
          text: "£40 a month",
          amount: "40",
        };
        break;
      case "CAD":
        level_one = {
          price: "price_1HVTVpDOVUu6yhjNZjhMEWO2",
          text: "$10 a month",
          amount: "10",
        };
        level_two = {
          price: "price_1HVTW1DOVUu6yhjNg1TIoWum",
          text: "$15 a month",
          amount: "15",
        };
        level_three = {
          price: "price_1HVTWCDOVUu6yhjNBjXG9Fe9",
          text: "$35 a month",
          amount: "35",
        };
        level_four = {
          price: "price_1HVTWMDOVUu6yhjNDz4y9Jzt",
          text: "$65 a month",
          amount: "65",
        };
        break;
      case "AUD":
        level_one = {
          price: "price_1HVTWeDOVUu6yhjNWKXIu8WJ",
          text: "$10 a month",
          amount: "10",
        };
        level_two = {
          price: "price_1HVTWtDOVUu6yhjNMZRWL8bX",
          text: "$15 a month",
          amount: "15",
        };
        level_three = {
          price: "price_1HVTX4DOVUu6yhjNK21runP2",
          text: "$35 a month",
          amount: "35",
        };
        level_four = {
          price: "price_1HVTXJDOVUu6yhjNl3UvxLrr",
          text: "$70 a month",
          amount: "70",
        };
        break;
      case "JPY":
        level_one = {
          price: "price_1HVTXgDOVUu6yhjNhETVDMbW",
          text: "¥500 a month",
          amount: "500",
        };
        level_two = {
          price: "price_1HVTXtDOVUu6yhjNtDjMUo4W",
          text: "¥1000 a month",
          amount: "1000",
        };
        level_three = {
          price: "price_1HVTYADOVUu6yhjNJoEjtHcY",
          text: "¥2500 a month",
          amount: "2500",
        };
        level_four = {
          price: "price_1HVTYLDOVUu6yhjNziS2gXhj",
          text: "¥5000 a month",
          amount: "5000",
        };
        break;
    }

    const handleOneTimeClick = async event => {
      // When the customer clicks on the button, redirect them to Checkout.
      let sep = "\u2028";
      let donorname = "";
      if (this.state.otDonor != "") {
        donorname = this.state.otDonor;
      }
      let forumname = "";
      if (this.state.otForum != "") {
        forumname = this.state.otForum;
      }
      let current_datetime = new Date();
      let datetime_str =
        current_datetime.getFullYear() +
        (current_datetime.getMonth() + 1) +
        current_datetime.getDate() +
        current_datetime.getHours() +
        current_datetime.getMinutes() +
        current_datetime.getSeconds();
      let currency_label = "";
      switch (this.state.otCurrency) {
        case "price_1HVRC7DOVUu6yhjNHWNMz6Zf":
          currency_label = "USD";
          break;
        case "price_1HVRHSDOVUu6yhjNhOGckxxU":
          currency_label = "EUR";
          break;
        case "price_1HVRNRDOVUu6yhjN0BsrpfOo":
          currency_label = "GBP";
          break;
        case "price_1HVRNpDOVUu6yhjNyoxCfwmQ":
          currency_label = "CAD";
          break;
        case "price_1HVROBDOVUu6yhjNuN2o56Ob":
          currency_label = "AUD";
          break;
        case "price_1HVROeDOVUu6yhjN83arFdQo":
          currency_label = "JPY";
          break;
      }
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          // Replace with the ID of your price
          { price: this.state.otCurrency, quantity: parseInt(this.state.otPrice) },
        ],
        mode: "payment",
        submitType: "donate",
        clientReferenceId: donorname + sep + forumname,
        successUrl: process.env.GATSBY_SITEURL + "/donate/success-stripe",
        cancelUrl: process.env.GATSBY_SITEURL + "/donate",
      });
    };

    return (
      <>
        <DefaultLayout frontmatter={frontmatter}>
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-16">
            <div>
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Stripe One-Time Payment
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Use this form to make a one-time payment.
                </p>
              </div>
              <form
                id="stripe-one-time"
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="space-y-8"
              >
                <div className="space-y-8">
                  <div className="pt-8">
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          for="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Amount
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="otPrice"
                            id="otPrice"
                            onChange={this.handleInputChange}
                            className="shadow-sm focus:ring-kodi focus:border-kodi block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          for="currency"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Currency
                        </label>
                        <div className="mt-1">
                          <select
                            id="otCurrency"
                            name="otCurrency"
                            onChange={this.handleInputChange}
                            className="shadow-sm focus:ring-kodi focus:border-kodi block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="price_1HVRC7DOVUu6yhjNHWNMz6Zf">
                              $ USD
                            </option>
                            <option value="price_1HVRHSDOVUu6yhjNhOGckxxU">
                              € EUR
                            </option>
                            <option value="price_1HVRNRDOVUu6yhjN0BsrpfOo">
                              £ GBP
                            </option>
                            <option value="price_1HVRNpDOVUu6yhjNyoxCfwmQ">
                              $ CAD
                            </option>
                            <option value="price_1HVROBDOVUu6yhjNuN2o56Ob">
                              $ AUD
                            </option>
                            <option value="price_1HVROeDOVUu6yhjN83arFdQo">
                              ¥ JPY
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          for="donor"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name for Donor Wall
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="otDonor"
                            id="otDonor"
                            onChange={this.handleInputChange}
                            className="shadow-sm focus:ring-kodi focus:border-kodi block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          for="forum"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Forum Username
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="otForum"
                            id="otForum"
                            onChange={this.handleInputChange}
                            className="shadow-sm focus:ring-kodi focus:border-kodi block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      onClick={handleOneTimeClick}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-kodi hover:bg-kodi-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kodi-lighter"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div>
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Stripe Recurring Payment
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Pick your recurring payment.
                </p>
              </div>
              <form
                id="stripe-recurring"
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="space-y-8 divide-y divide-gray-200"
              >
                <div className="space-y-8 divide-y divide-gray-200">
                  <div className="pt-8">
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          for="donor"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name for Donor Wall
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="otDonor"
                            id="otDonor"
                            onChange={this.handleInputChange}
                            className="shadow-sm focus:ring-kodi focus:border-kodi block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          for="forum"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Forum Username
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="otForum"
                            id="otForum"
                            onChange={this.handleInputChange}
                            className="shadow-sm focus:ring-kodi focus:border-kodi block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          for="currency"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Currency
                        </label>
                        <div className="mt-1">
                          <select
                            id="recCurrency"
                            name="recCurrency"
                            onChange={this.handleInputChange}
                            className="shadow-sm focus:ring-kodi focus:border-kodi block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="USD">$ USD</option>
                            <option value="EUR">€ EUR</option>
                            <option value="GBP">£ GBP</option>
                            <option value="CAD">$ CAD</option>
                            <option value="AUD">$ AUD</option>
                            <option value="JPY">¥ JPY</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          for="buttons"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Recurring Levels
                        </label>
                        <div className="grid grid-cols-1 -mt-1">
                          <div>
                            <ButtonStripe
                              stripePromise={stripePromise}
                              amount={level_one.amount}
                              currency={this.state.recCurrency}
                              price_id={level_one.price}
                              button_text={level_one.text}
                              donorname={this.state.recDonor}
                              forumname={this.state.recForum}
                            />
                          </div>
                          <div>
                            <ButtonStripe
                              stripePromise={stripePromise}
                              amount={level_two.amount}
                              currency={this.state.recCurrency}
                              price_id={level_two.price}
                              button_text={level_two.text}
                              donorname={this.state.recDonor}
                              forumname={this.state.recForum}
                            />
                          </div>
                          <div>
                            <ButtonStripe
                              stripePromise={stripePromise}
                              amount={level_three.amount}
                              currency={this.state.recCurrency}
                              price_id={level_three.price}
                              button_text={level_three.text}
                              donorname={this.state.recDonor}
                              forumname={this.state.recForum}
                            />
                          </div>
                          <div>
                            <ButtonStripe
                              stripePromise={stripePromise}
                              amount={level_four.amount}
                              currency={this.state.recCurrency}
                              price_id={level_four.price}
                              button_text={level_four.text}
                              donorname={this.state.recDonor}
                              forumname={this.state.recForum}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DefaultLayout>
      </>
    );
  }
}