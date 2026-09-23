import type { IPhone } from '../types';

/**
 * Every iPhone in the model, in release order.
 *
 * - `releaseDate`: the first US in-store sale date.
 * - `msrp`: the US launch price of the base storage tier, in USD.
 * - `launchClose`: the split-adjusted AAPL close on the release date (or the
 *   last trading day before it). The app reads prices from the bundled price
 *   history. This column is a reference copy for the Excel workbook, and a
 *   unit test checks that it agrees with the history.
 */
export const IPHONES: IPhone[] = [
  { id: 'iphone', model: 'iPhone', releaseDate: '2007-06-29', msrp: 499, launchClose: 4.36 },
  { id: 'iphone-3gs', model: 'iPhone 3GS', releaseDate: '2009-06-19', msrp: 499, launchClose: 4.98 },
  { id: 'iphone-4', model: 'iPhone 4', releaseDate: '2010-06-24', msrp: 549, launchClose: 9.61 },
  { id: 'iphone-4s', model: 'iPhone 4S', releaseDate: '2011-10-14', msrp: 649, launchClose: 15.07 },
  { id: 'iphone-5', model: 'iPhone 5', releaseDate: '2012-09-21', msrp: 649, launchClose: 25.0 },
  { id: 'iphone-5c', model: 'iPhone 5c', releaseDate: '2013-09-20', msrp: 549, launchClose: 16.69 },
  { id: 'iphone-5s', model: 'iPhone 5s', releaseDate: '2013-09-20', msrp: 649, launchClose: 16.69 },
  { id: 'iphone-6', model: 'iPhone 6', releaseDate: '2014-09-19', msrp: 649, launchClose: 25.24 },
  { id: 'iphone-6-plus', model: 'iPhone 6 Plus', releaseDate: '2014-09-19', msrp: 749, launchClose: 25.24 },
  { id: 'iphone-6s', model: 'iPhone 6s', releaseDate: '2015-09-25', msrp: 649, launchClose: 28.68 },
  { id: 'iphone-6s-plus', model: 'iPhone 6s Plus', releaseDate: '2015-09-25', msrp: 749, launchClose: 28.68 },
  { id: 'iphone-se', model: 'iPhone SE', releaseDate: '2016-03-31', msrp: 399, launchClose: 27.25 },
  { id: 'iphone-7', model: 'iPhone 7', releaseDate: '2016-09-16', msrp: 649, launchClose: 28.73 },
  { id: 'iphone-7-plus', model: 'iPhone 7 Plus', releaseDate: '2016-09-16', msrp: 769, launchClose: 28.73 },
  { id: 'iphone-8', model: 'iPhone 8', releaseDate: '2017-09-22', msrp: 699, launchClose: 37.97 },
  { id: 'iphone-8-plus', model: 'iPhone 8 Plus', releaseDate: '2017-09-22', msrp: 799, launchClose: 37.97 },
  { id: 'iphone-x', model: 'iPhone X', releaseDate: '2017-11-03', msrp: 999, launchClose: 43.13 },
  { id: 'iphone-xs', model: 'iPhone XS', releaseDate: '2018-09-21', msrp: 999, launchClose: 54.42 },
  { id: 'iphone-xs-max', model: 'iPhone XS Max', releaseDate: '2018-09-21', msrp: 1099, launchClose: 54.42 },
  { id: 'iphone-xr', model: 'iPhone XR', releaseDate: '2018-10-26', msrp: 749, launchClose: 54.08 },
  { id: 'iphone-11', model: 'iPhone 11', releaseDate: '2019-09-20', msrp: 699, launchClose: 54.43 },
  { id: 'iphone-11-pro', model: 'iPhone 11 Pro', releaseDate: '2019-09-20', msrp: 999, launchClose: 54.43 },
  { id: 'iphone-11-pro-max', model: 'iPhone 11 Pro Max', releaseDate: '2019-09-20', msrp: 1099, launchClose: 54.43 },
  { id: 'iphone-se-2', model: 'iPhone SE (2nd gen)', releaseDate: '2020-04-24', msrp: 399, launchClose: 70.74 },
  { id: 'iphone-12', model: 'iPhone 12', releaseDate: '2020-10-23', msrp: 799, launchClose: 115.04 },
  { id: 'iphone-12-pro', model: 'iPhone 12 Pro', releaseDate: '2020-10-23', msrp: 999, launchClose: 115.04 },
  { id: 'iphone-12-mini', model: 'iPhone 12 mini', releaseDate: '2020-11-13', msrp: 699, launchClose: 119.26 },
  { id: 'iphone-12-pro-max', model: 'iPhone 12 Pro Max', releaseDate: '2020-11-13', msrp: 1099, launchClose: 119.26 },
  { id: 'iphone-13', model: 'iPhone 13', releaseDate: '2021-09-24', msrp: 799, launchClose: 146.92 },
  { id: 'iphone-13-mini', model: 'iPhone 13 mini', releaseDate: '2021-09-24', msrp: 699, launchClose: 146.92 },
  { id: 'iphone-13-pro', model: 'iPhone 13 Pro', releaseDate: '2021-09-24', msrp: 999, launchClose: 146.92 },
  { id: 'iphone-13-pro-max', model: 'iPhone 13 Pro Max', releaseDate: '2021-09-24', msrp: 1099, launchClose: 146.92 },
  { id: 'iphone-se-3', model: 'iPhone SE (3rd gen)', releaseDate: '2022-03-18', msrp: 429, launchClose: 163.98 },
  { id: 'iphone-14', model: 'iPhone 14', releaseDate: '2022-09-16', msrp: 799, launchClose: 150.7 },
  { id: 'iphone-14-pro', model: 'iPhone 14 Pro', releaseDate: '2022-09-16', msrp: 999, launchClose: 150.7 },
  { id: 'iphone-14-pro-max', model: 'iPhone 14 Pro Max', releaseDate: '2022-09-16', msrp: 1099, launchClose: 150.7 },
  { id: 'iphone-14-plus', model: 'iPhone 14 Plus', releaseDate: '2022-10-07', msrp: 899, launchClose: 140.09 },
  { id: 'iphone-15', model: 'iPhone 15', releaseDate: '2023-09-22', msrp: 799, launchClose: 174.79 },
  { id: 'iphone-15-plus', model: 'iPhone 15 Plus', releaseDate: '2023-09-22', msrp: 899, launchClose: 174.79 },
  { id: 'iphone-15-pro', model: 'iPhone 15 Pro', releaseDate: '2023-09-22', msrp: 999, launchClose: 174.79 },
  { id: 'iphone-15-pro-max', model: 'iPhone 15 Pro Max', releaseDate: '2023-09-22', msrp: 1199, launchClose: 174.79 },
  { id: 'iphone-16', model: 'iPhone 16', releaseDate: '2024-09-20', msrp: 799, launchClose: 228.2 },
  { id: 'iphone-16-plus', model: 'iPhone 16 Plus', releaseDate: '2024-09-20', msrp: 899, launchClose: 228.2 },
  { id: 'iphone-16-pro', model: 'iPhone 16 Pro', releaseDate: '2024-09-20', msrp: 999, launchClose: 228.2 },
  { id: 'iphone-16-pro-max', model: 'iPhone 16 Pro Max', releaseDate: '2024-09-20', msrp: 1199, launchClose: 228.2 },
  { id: 'iphone-16e', model: 'iPhone 16e', releaseDate: '2025-02-28', msrp: 599, launchClose: 241.84 },
  { id: 'iphone-17', model: 'iPhone 17', releaseDate: '2025-09-19', msrp: 799, launchClose: 245.5 },
  { id: 'iphone-air', model: 'iPhone Air', releaseDate: '2025-09-19', msrp: 999, launchClose: 245.5 },
  { id: 'iphone-17-pro', model: 'iPhone 17 Pro', releaseDate: '2025-09-19', msrp: 1099, launchClose: 245.5 },
  { id: 'iphone-17-pro-max', model: 'iPhone 17 Pro Max', releaseDate: '2025-09-19', msrp: 1199, launchClose: 245.5 },
  { id: 'iphone-17e', model: 'iPhone 17e', releaseDate: '2026-03-11', msrp: 599, launchClose: 260.81 },
  { id: 'iphone-18-pro', model: 'iPhone 18 Pro', releaseDate: '2026-09-18', msrp: 1199, launchClose: 336.13 },
  { id: 'iphone-18-pro-max', model: 'iPhone 18 Pro Max', releaseDate: '2026-09-18', msrp: 1299, launchClose: 336.13 },
];
