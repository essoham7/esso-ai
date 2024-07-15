import { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);

  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // STORAGE ARCTICLE
  useEffect(() => {
    const artclieFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    if (artclieFromLocalStorage) {
      setAllArticles(artclieFromLocalStorage);
    }
  }, []);

  //FESHING SUMMARY
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };

      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };
  // DELETE URL
  // const handleDelete = (url) => {
  //     localStorage.removeItem(url);

  //     const filtered = allArticles.filter((item) => item.url !== url);
  //     setAllArticles(filtered);
  //   }

  const getAllArticlesFromLocalStorage = () => {
    const articlesFromLocalStorage = localStorage.getItem("articles");

    if (articlesFromLocalStorage) {
      setAllArticles(JSON.parse(articlesFromLocalStorage));
    }
  };

  useEffect(() => {
    getAllArticlesFromLocalStorage();
  }, []);

  const handleDelete = (url) => {
    const filtered = allArticles.filter((item) => item.url !== url);
    setAllArticles(filtered);
    localStorage.setItem("articles", JSON.stringify(filtered));
  };

  //COPY URL
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}

      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a url"
            value={article.url}
            onChange={(e) =>
              setArticle({
                ...article,
                url: e.target.value,
              })
            }
            required
            className="block w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-12 text-sm shadow-lg font-satoshi font-medium focus:border-black focus:outline-none focus:ring-0 peer-focus:border-gray-700 peer-focus:text-gray-700"
          />
          <button
            type="submit"
            className="hover:border-gray-700 hover:text-gray-700 absolute inset-y-0 right-0 my-1.5 mr-1.5 flex w-10 items-center justify-center rounded border border-gray-200 font-sans text-sm font-medium text-gray-400"
          >
            <p>↵</p>
          </button>
        </form>

        {/*Browse URL Histrory */}

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, url) => (
            <div
              key={`link-${url}`}
              onClick={() => setArticle(item)}
              className="p-3 flex justify-start items-center flex-row bg-white border border-gray-200 gap-3 rounded-lg cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-full bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur flex justify-center items-center cursor-pointer"
                onClick={() => handleCopy(item.url)}
              >
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain "
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
              <div onClick={() => handleDelete(item.url)}>Delete</div>
            </div>
          ))}
        </div>
      </div>
      {/*Display Result */}

      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn t supposed to happen ...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white/20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur p-4">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
