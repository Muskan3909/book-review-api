const getPagination = (page, limit) => {
  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (currentPage - 1) * pageSize;
  
  return {
    page: currentPage,
    limit: pageSize,
    skip
  };
};

const getPaginationInfo = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

module.exports = { getPagination, getPaginationInfo };