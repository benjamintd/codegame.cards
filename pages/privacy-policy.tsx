import React from "react";
import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";

export default () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/">
        <h1 className="h1 font-mono mt-6 cursor-pointer">codenames.cards</h1>
      </Link>

      <div className="mv-6 rounded-lg border-2 border-blue-500 bg-blue-200 p-4">
        <strong>{t("long-story-short", "Long story short")}</strong>
        <Trans i18nKey="privacy-tldr">
          <p>
            We keep games and chats in our database for some period of time, but
            they may be deleted at any moment. This is the only information we
            store.
          </p>
          <p>
            We use cookies to be able to see analytics about the site's usage
            (demographics, length of sessions, types of games played). Those
            analytics do not contain personally identifiable information.
          </p>
          <p>Our analytics provider is Google Analytics.</p>
        </Trans>
      </div>

      <div className="text-sm">
        <h2 className="h2 mt-4 mb-2">Privacy Policy</h2>

        <p>
          This Privacy Policy document contains types of information that is
          collected and recorded by codenames.cards and how we use it.
        </p>

        <p>
          If you have additional questions or require more information about our
          Privacy Policy, do not hesitate to contact us at
          benjamin.tdm@gmail.com.
        </p>

        <p>
          This Privacy Policy applies only to our online activities and is valid
          for visitors to our website with regards to the information that they
          shared and/or collect in codenames.cards. This policy is not
          applicable to any information collected offline or via channels other
          than this website.
        </p>

        <h2 className="h2 mt-4 mb-2">Consent</h2>

        <p>
          By using our website, you hereby consent to our Privacy Policy and
          agree to its terms.
        </p>

        <h2 className="h2 mt-4 mb-2">Information we collect</h2>

        <p>
          The personal information that you are asked to provide, and the
          reasons why you are asked to provide it, will be made clear to you at
          the point we ask you to provide your personal information.
        </p>
        <p>
          If you contact us directly, we may receive additional information
          about you such as your name, email address, phone number, the contents
          of the message and/or attachments you may send us, and any other
          information you may choose to provide.
        </p>

        <h2>How we use your information</h2>

        <p>We use the information we collect in various ways, including to:</p>

        <ul>
          <li>Provide, operate, and maintain our webste</li>
          <li>Improve, personalize, and expand our webste</li>
          <li>Understand and analyze how you use our webste</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h2 className="h2 mt-4 mb-2">Log Files</h2>

        <p>
          codenames.cards follows a standard procedure of using log files. These
          files log visitors when they visit websites. All hosting companies do
          this and a part of hosting services' analytics. The information
          collected by log files include internet protocol (IP) addresses,
          browser type, Internet Service Provider (ISP), date and time stamp,
          referring/exit pages, and possibly the number of clicks. These are not
          linked to any information that is personally identifiable. The purpose
          of the information is for analyzing trends, administering the site,
          tracking users' movement on the website, and gathering demographic
          information.
        </p>

        <h2 className="h2 mt-4 mb-2">Cookies and Web Beacons</h2>

        <p>
          Like any other website, codenames.cards uses 'cookies'. These cookies
          are used to store information including visitors' preferences, and the
          pages on the website that the visitor accessed or visited. The
          information is used to optimize the users' experience by customizing
          our web page content based on visitors' browser type and/or other
          information.
        </p>

        <p>
          For more general information on cookies, please read{" "}
          <a href="https://www.cookieconsent.com/what-are-cookies/">
            "What Are Cookies"
          </a>
          .
        </p>

        <h2 className="h2 mt-4 mb-2">Third Party Privacy Policies</h2>

        <p>
          codenames.cards's Privacy Policy does not apply to other advertisers
          or websites. Thus, we are advising you to consult the respective
          Privacy Policies of these third-party ad servers for more detailed
          information. It may include their practices and instructions about how
          to opt-out of certain options.{" "}
        </p>

        <p>
          You can choose to disable cookies through your individual browser
          options. To know more detailed information about cookie management
          with specific web browsers, it can be found at the browsers'
          respective websites.
        </p>

        <h2 className="h2 mt-4 mb-2">
          CCPA Privacy Rights (Do Not Sell My Personal Information)
        </h2>

        <p>
          Under the CCPA, among other rights, California consumers have the
          right to:
        </p>
        <p>
          Request that a business that collects a consumer's personal data
          disclose the categories and specific pieces of personal data that a
          business has collected about consumers.
        </p>
        <p>
          Request that a business delete any personal data about the consumer
          that a business has collected.
        </p>
        <p>
          Request that a business that sells a consumer's personal data, not
          sell the consumer's personal data.
        </p>
        <p>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </p>

        <h2 className="h2 mt-4 mb-2">GDPR Data Protection Rights</h2>

        <p>
          We would like to make sure you are fully aware of all of your data
          protection rights. Every user is entitled to the following:
        </p>
        <p>
          The right to access – You have the right to request copies of your
          personal data. We may charge you a small fee for this service.
        </p>
        <p>
          The right to rectification – You have the right to request that we
          correct any information you believe is inaccurate. You also have the
          right to request that we complete the information you believe is
          incomplete.
        </p>
        <p>
          The right to erasure – You have the right to request that we erase
          your personal data, under certain conditions.
        </p>
        <p>
          The right to restrict processing – You have the right to request that
          we restrict the processing of your personal data, under certain
          conditions.
        </p>
        <p>
          The right to object to processing – You have the right to object to
          our processing of your personal data, under certain conditions.
        </p>
        <p>
          The right to data portability – You have the right to request that we
          transfer the data that we have collected to another organization, or
          directly to you, under certain conditions.
        </p>
        <p>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </p>

        <h2 className="h2 mt-4 mb-2">Children's Information</h2>

        <p>
          Another part of our priority is adding protection for children while
          using the internet. We encourage parents and guardians to observe,
          participate in, and/or monitor and guide their online activity.
        </p>

        <p>
          codenames.cards does not knowingly collect any Personal Identifiable
          Information from children under the age of 13. If you think that your
          child provided this kind of information on our website, we strongly
          encourage you to contact us immediately and we will do our best
          efforts to promptly remove such information from our records.
        </p>
      </div>

      <style jsx>{`
        p {
          line-height: 1.7;
          margin-top: 6px;
          margin-bottom: 6px;
        }

        a {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
