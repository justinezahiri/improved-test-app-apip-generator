import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Formik } from "formik";
import { fetch } from "../../utils/dataAccess";
import { Book } from "../../types/Book";
import Head from "next/head";

interface Props {
  book?: Book;
}

export const Form: FunctionComponent<Props> = ({ book }) => {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(book["@id"], { method: "DELETE" });
      router.push("/books");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <Head>
          <title>Books Form page</title>
          <meta property="og:title" content="Books list page" key="title" />
        </Head>
      </div>
      {book ? <h1>Edit Book {book["@id"]}</h1> : <h1>Create Book</h1>}
      <Formik
        initialValues={book ? { ...book } : new Book()}
        validate={(values) => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          const isCreation = !values["@id"];
          try {
            await fetch(isCreation ? "/books" : values["@id"], {
              method: isCreation ? "POST" : "PUT",
              body: JSON.stringify(values),
            });
            setStatus({
              isValid: true,
              msg: `Element ${isCreation ? "created" : "updated"}.`,
            });
            router.push("/books");
          } catch (error) {
            setStatus({
              isValid: false,
              msg: `Error when ${
                isCreation ? "creating" : "updating"
              } the resource.`,
            });
          }
          setSubmitting(false);
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-control-label" htmlFor="_isbn">
                isbn
              </label>
              <input
                name="isbn"
                id="_isbn"
                value={values.isbn ?? ""}
                type="text"
                placeholder="The ISBN of the book"
                className={`form-control${
                  errors.isbn && touched.isbn ? " is-invalid" : ""
                }`}
                aria-invalid={errors.isbn && touched.isbn}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.isbn && touched.isbn && (
              <div className="invalid-feedback">{errors.isbn}</div>
            )}
            <div className="form-group">
              <label className="form-control-label" htmlFor="_title">
                title
              </label>
              <input
                name="title"
                id="_title"
                value={values.title ?? ""}
                type="text"
                placeholder="The title of the book"
                className={`form-control${
                  errors.title && touched.title ? " is-invalid" : ""
                }`}
                aria-invalid={errors.title && touched.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.title && touched.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}
            <div className="form-group">
              <label className="form-control-label" htmlFor="_description">
                description
              </label>
              <input
                name="description"
                id="_description"
                value={values.description ?? ""}
                type="text"
                placeholder="A description of the item"
                className={`form-control${
                  errors.description && touched.description ? " is-invalid" : ""
                }`}
                aria-invalid={errors.description && touched.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.description && touched.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
            <div className="form-group">
              <label className="form-control-label" htmlFor="_author">
                author
              </label>
              <input
                name="author"
                id="_author"
                value={values.author ?? ""}
                type="text"
                placeholder="The author of this content or rating. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably"
                className={`form-control${
                  errors.author && touched.author ? " is-invalid" : ""
                }`}
                aria-invalid={errors.author && touched.author}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.author && touched.author && (
              <div className="invalid-feedback">{errors.author}</div>
            )}
            <div className="form-group">
              <label className="form-control-label" htmlFor="_publicationDate">
                publicationDate
              </label>
              <input
                name="publicationDate"
                id="_publicationDate"
                value={values.publicationDate ?? ""}
                type="text"
                placeholder="The date on which the CreativeWork was created or the item was added to a DataFeed"
                className={`form-control${
                  errors.publicationDate && touched.publicationDate
                    ? " is-invalid"
                    : ""
                }`}
                aria-invalid={errors.publicationDate && touched.publicationDate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.publicationDate && touched.publicationDate && (
              <div className="invalid-feedback">{errors.publicationDate}</div>
            )}
            <div className="form-group">
              <label className="form-control-label" htmlFor="_reviews">
                reviews
              </label>
              <input
                name="reviews"
                id="_reviews"
                value={values.reviews ?? ""}
                type="text"
                placeholder="The book's reviews"
                className={`form-control${
                  errors.reviews && touched.reviews ? " is-invalid" : ""
                }`}
                aria-invalid={errors.reviews && touched.reviews}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.reviews && touched.reviews && (
              <div className="invalid-feedback">{errors.reviews}</div>
            )}

            {status && status.msg && (
              <div
                className={`alert ${
                  status.isValid ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <Link href="/books">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {book && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
