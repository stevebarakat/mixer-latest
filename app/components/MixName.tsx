import { useState, useRef, useCallback } from "react";
import { useFetcher } from "@remix-run/react";
import Hidden from "~/components/Hidden";
import { unSlugify } from "~/utils";
import { editIcon } from "~/assets/editIcon";

type Props = {
  i: number;
  userMixes: MixSettings[];
  userMix: MixSettings;
  user: User;
};

function MixName({ i, userMixes, userMix, user }: Props) {
  const fetcher = useFetcher();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState<boolean[]>(
    new Array(userMixes.length).fill(false)
  );

  const handleUpdate = useCallback(
    (event: React.FocusEvent) => {
      const target = event.target as HTMLButtonElement;
      const { id, value } = target;
      fetcher.submit(
        {
          actionName: "changeMixName",
          id,
          name: value,
        },
        { method: "post", action: "/userActions", replace: true }
      );
    },
    [fetcher]
  );

  const focusInput = () => {
    if (!inputRef.current) throw Error("divRef is not assigned");
    inputRef.current.focus();
  };

  const handleEdit = (event: React.FormEvent<HTMLButtonElement>): void => {
    const selectedId = parseInt(event.currentTarget.id[0], 10);

    setTimeout(focusInput, 100);

    const mixIds = Object.keys(userMixes);
    mixIds.map((id, i) => {
      const mixId = parseInt(id, 10);
      if (mixId === selectedId) {
        isEditing[i] = !isEditing[i];
        setIsEditing([...isEditing]);
      }
      return isEditing;
    });
  };

  function handleBlur() {
    isEditing.map((_, i) => (isEditing[i] = false));
  }

  const preventSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    inputRef.current?.blur();
  };

  return (
    <>
      {isEditing[i] ? (
        <fetcher.Form
          method="post"
          onBlur={handleUpdate}
          onSubmit={preventSubmit}
        >
          <Hidden name="actionName" value="changeMixName" />
          <Hidden name="id" value={userMix.id} />
          <input
            ref={inputRef}
            name="mix-name"
            id={userMix.id}
            defaultValue={
              userMix.mixName
                ? `${unSlugify(userMix.mixName)}`
                : "mix not found"
            }
            autoComplete="off"
            style={inlineTextInput}
            onBlur={handleBlur}
          />
        </fetcher.Form>
      ) : (
        <>
          <button
            id={`${i}-editMixName`}
            title="Edit Mix Name"
            onClick={handleEdit}
            className="button link-btn"
          >
            {editIcon}
          </button>
        </>
      )}
    </>
  );
}

export default MixName;

const inlineTextInput = {
  width: "100%",
  cursor: "text",
  outline: "none",
  background: "black",
  padding: "8px",
  border: "none",
  color: "white",
};
