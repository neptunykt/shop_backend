const getPagination = function (page, size) {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = function (data, page, limit) {
  const { count: recordCount, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(recordCount / limit);
  return { recordCount, items, totalPages, currentPage };
};
module.exports = { getPagination, getPagingData };

