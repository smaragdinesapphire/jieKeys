import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { changeLang } from './appAction';

const ReduxIntlProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.app);
  useEffect(() => {
    /* 將瀏覽器預設語系帶入 */
    let lang = navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage;
    lang = lang.toLowerCase();
    changeLang(lang, dispatch);
  }, []);
  // console.info('language change', language);
  if (language && language.messages) {
    return (
      <IntlProvider locale={language.locale} messages={language.messages}>
        {children}
      </IntlProvider>
    );
  }
  return false;
};

export default ReduxIntlProvider;
