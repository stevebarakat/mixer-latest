type Props = {
  name: string;
  value: string;
};

export default function Hidden({ name, value }: Props) {
  return <input type="hidden" name={name} value={value} />;
}
