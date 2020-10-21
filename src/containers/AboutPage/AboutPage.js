import React from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './AboutPage.css';
import image from './jael-bio-edited@2x.png';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About NurtureUp',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>

          <img className={css.coverImage} src={image} alt="My first ice cream." />

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>

            </div>

            <div className={css.contentMain}>
              <h2>
                Jael Jackley
              </h2>
              <h3>CEO</h3>

              <p>
                For Jael's bio, new text with some minor grammar changes and tweaks: Jael Marajh is the young, creative, vibrant and visionary millennial behind the first (and currently only) platform connecting moms and newborn babies with services such as Baby Care Specialists, Safety Service Providers, Post-partum Care Professionals and Healthcare Providers, to name a few.
              </p>

              <p>
                Being a mother herself, Jael understands the challenges that parents have. This platform was created to ease some of the burden on parents by creating easy access to resources they need.
              </p>

              <p>
                Jael has worked with young children and babies for the past ten years. She has helped more than sixty mothers and families nurture and properly care for babies while they transition through inevitable and challenging changes. Her training and certification background includes:
              </p>

              <p>
                Jael is no stranger to entrepreneurial ventures. She currently owns a meal prep-juicing and catering business called Kitchen Jael. She is also working on her International Board Certified Lactation Consultant certification. Jael lives in Laurel, Maryland with her family.
              </p>

            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default AboutPage;
