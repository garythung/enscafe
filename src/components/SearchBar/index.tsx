import { Form, Formik, useField } from "formik";

type Values = {
  search: string;
};

type Props = {
  placeholder: string;
};

const Input = ({ label, helpText, ...props }) => {
  const [field] = useField(props as any);

  const onChange = (e) => {
    field.onChange(e);
  };

  return (
    <input
      {...field}
      {...props}
      onChange={onChange}
      className="w-full px-4 border-1 border-black font-pressura text-lg"
    />
  );
};

export default function SearchBar({ placeholder }: Props) {
  const onSubmit = async (values: Values) => {
    if (!values.search) {
      return;
    }

    if (values.search.slice(values.search.length - 4) === ".eth") {
      window.location.href = `/names/${values.search}`;
    } else {
      window.location.href = `/names/${values.search}.eth`;
    }
  };

  return (
    <Formik
      initialValues={{
        search: "",
      }}
      onSubmit={onSubmit}
    >
      <Form className="flex self-center gap-2 h-12">
        <Input
          label="Search"
          id="search"
          name="search"
          helpText="Search here"
          type="text"
          placeholder={placeholder}
        />
      </Form>
    </Formik>
  );
}
