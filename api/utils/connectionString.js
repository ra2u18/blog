exports.getConnectionString = () => {
  const mapFilter = {
    '<PASSWORD>': process.env.DB_PASSWORD,
    '<USERNAME>': process.env.DB_USERNAME,
  };

  return process.env.DB.replace(/<PASSWORD>|<USERNAME>/gi, (matched) => mapFilter[matched]);
};
