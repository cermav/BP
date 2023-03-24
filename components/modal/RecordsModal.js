import TransparentModal from "./TransparentModal";
import React, { useState, useEffect } from "react";
import { getAuthorizationHeader } from "../../services/AuthToken";
import { useForm } from "react-hook-form";
import { formatTimestamp } from "../../helpers/formatTimestamp";
import SafariDate from "../../helpers/SafariDate";
import Bowser from "bowser";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { withNotie } from "react-notie";
import { useRouter } from "next/router";

const RecordsModal = (props) => {
  const router = useRouter();
  const petId = props?.pet?.id;
  const title = props?.title;
  const hide = props.hide ? props.hide : null;
  const editRecord = props.editRecord ? props.editRecord : null;
  const appointmentId = props.appointmentId ? props.appointmentId : null;
  const vetsWithDistance = props?.vetMetaArray;
  const [selectedDoctor, setSelectedDoctor] = useState(props.selectedDoctor ? props.selectedDoctor : null);
  const browser = Bowser.getParser(window.navigator.userAgent);
  const { handleSubmit, errors, register } = useForm();

  const [allVets, setAllVets] = useState(
    typeof window === "object" && window.localStorage && window.localStorage.getItem("searchVets") !== "undefined"
      ? JSON.parse(window.localStorage.getItem("searchVets"))
      : []
  );
  const [description, setDescription] = useState(editRecord ? editRecord?.description : null);
  const [date, setDate] = useState(editRecord ? editRecord?.date : null);
  const [notes, setNotes] = useState(editRecord ? editRecord?.notes : null);
  const [doctor, setDoctor] = useState(editRecord ? editRecord?.doctor_id : null);
  const [currentId, setCurrentId] = useState(editRecord ? editRecord?.doctor_id : null);
  const [vetSearch, setVetSearch] = useState(false);
  const [createFiles, setCreateFiles] = useState([]);
  const [updateFiles, setUpdateFiles] = useState(editRecord ? editRecord?.files : null);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [createNames, setCreateNames] = useState([]);
  const [updateNames, setUpdateNames] = useState([]);
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  const [createdRecord, setCreatedRecord] = useState(null);
  useEffect(() => {
    if (currentId && document.getElementById(currentId))
      document.getElementById(currentId).className = "vetMeta selected";
    currentId && setDoctor(currentId);
  }, [(vetSearch, selectedDoctor, document?.getElementById(currentId)), currentId]);
  const handleVetOnSelect = (item) => {
    setDoctor(item.user_id);
  };
  useEffect(() => {
    if (date && errors.date) delete errors?.date;
  }, [date]);
  const handleCurrentId = (id) => {
    if (id === currentId) {
      setCurrentId(null);
      setDoctor(null);
    } else {
      setCurrentId(id);
      setDoctor(id);
    }
  };
  const handlePropVet = () => {
    if (editRecord) {
      const vetIds = props?.vetsArray?.map((vet) => vet.id);
      const vetFound = vetIds.includes(editRecord?.doctor_id);
      return !vetFound;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(process.env.apiURL + "doctors-search", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const responseArray = await response.json();
      setAllVets(responseArray);
      if (typeof window === "object" && window.localStorage)
        window.localStorage.setItem("searchVets", JSON.stringify(responseArray));
    };
    if (typeof window === "object") window.scrollTo({ top: 0 });
    if (allVets === null || allVets?.length === 0) fetchData();
  }, []);
  const handleSign = (fileName) => {
    const extension = fileName.slice(-6);
    if (extension.includes("pdf")) return "/icons/file-pdf-light.svg";
    if (extension.includes("jpg")) return "/icons/file-image-light.svg";
    if (extension.includes("jpeg")) return "/icons/file-image-light.svg";
    if (extension.includes("png")) return "/icons/file-image-light.svg";
    if (extension.includes("svg")) return "/icons/file-image-light.svg";
  };
  const avoidChars = (fileName) => {
    const regex = new RegExp(/[<>:"/\|?*]/);
    const err = regex.test(fileName);
    return err;
  };
  const avoidFileTypes = (fileType) => {
    const validTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg",
      "text/plain",
      "application/pdf",
      "	application/vnd.oasis.opendocument.text",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const valid = validTypes.includes(fileType);
    return valid;
  };
  const addFiles = (files) => {
    const fileArray = [...files];
    const invalidSize = fileArray.map((item) => item.size > 10000000).includes(true);
    if (invalidSize) return props.notie.error("Nelze nahrát soubor větší než 10 MB");
    const valid = fileArray.map((item) => avoidFileTypes(item.type));
    if (valid.includes(false)) return props.notie.error("Soubor tohoto typu nemůžeme uložit.");
    setCreateFiles((createFiles) => [...createFiles, ...files]);
  };
  // clear event so the same file can be uploaded twice in row
  useEffect(() => {
    document.getElementById("fileInput").value = "";
  }, [createFiles]);
  const removeFile = (file, index) => {
    // remove file to upload
    if (file.lastModified) {
      const newFiles = createFiles.filter((item) => item !== file);
      const newNames = createNames.filter((item) => item.index !== index);
      const newCreateNames = newNames.map((item) => {
        return item.index > index ? { ...item, index: item.index - 1 } : { ...item };
      });
      setCreateFiles(newFiles);
      setCreateNames(newCreateNames);
      // remove file already uploaded
    } else {
      const newFiles = updateFiles.filter((item) => item !== file);
      const newNames = updateNames.filter((item) => item.id !== file.id);
      const removeFiles = updateFiles.filter((item) => item == file);
      setDeleteFiles([...deleteFiles, ...removeFiles]);
      setUpdateFiles(newFiles);
      setUpdateNames(newNames);
    }
  };
  const createFileName = (newName, index) => {
    const faulty = avoidChars(newName);
    if (faulty === true) return props.notie.error("Název souboru obsahuje nepovolené znaky.");
    const oldNames = createNames;
    const nameObject = {
      index: index,
      name: newName,
    };
    oldNames[index] = nameObject;
    setCreateNames(oldNames);
  };
  useEffect(() => {
    Object.keys(errors).length > 0 && props.notie.error("Nejsou vyplněna povinná pole.");
  }, [errors]);
  const updateFileName = (newName, id) => {
    const faulty = avoidChars(newName);
    if (faulty === true) return props.notie.error("Název souboru obsahuje nepovolené znaky.");
    const nameObject = {
      id: id,
      name: newName === "" ? updateFiles.filter((item) => item.id == id)[0]?.file_name : newName,
    };
    const newNames = updateNames.filter((item) => item.id !== id);
    setUpdateNames([...newNames, nameObject]);
  };
  const onSubmit = async () => {
    try {
      if (!date) return;
      const recordObject = {
        description: description,
        doctor_id: doctor,
        date: formatTimestamp(date),
        notes: notes,
      };
      if (props.type === "add") {
        const createRecord = async () => {
          if (createdRecord) return null;
          const result = await fetch(process.env.apiURL + "pets/" + router.query.slug + "/records/store", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: getAuthorizationHeader(),
            },
            method: "POST",
            body: JSON.stringify(recordObject),
          });
          const response = await result.json();
          if (response.errors) throw new Error(response.errors);
          setCreatedRecord(response.id);
          return response.id;
        };
        const Id = await createRecord();
        if (typeof Id === "number" || typeof createdRecord === "number") {
          if (createFiles.length > 0) {
            props.notie.info("Vydržte, nahrávám soubory");
            var data = new FormData();
            for (var i = 0; i < createFiles.length; i++) {
              var fileData = createFiles[i];
              data.append(`file${i}`, fileData);
            }
            const recordId = createdRecord ? createdRecord : Id;
            const fileUpload = await fetch(
              process.env.apiURL + "pets/" + router.query.slug + "/records/store/" + recordId + "/files",
              {
                headers: {
                  Authorization: getAuthorizationHeader(),
                },
                method: "POST",
                body: data,
              }
            );
            const response = await fileUpload.json();
            if (response.errors) throw new Error(response.errors);
            // rename existing files
            if (createNames.length > 0) {
              const renameFunction = async (response) => {
                const rename = async (fileID, fileName) => {
                  const result = await fetch(
                    process.env.apiURL + "pets/" + petId + "/records/" + Id + "/file-rename/" + fileID,
                    {
                      headers: {
                        Authorization: getAuthorizationHeader(),
                      },
                      method: "PUT",
                      body: JSON.stringify({ name: fileName }),
                    }
                  );
                  if (result.errors) throw new Error(result.errors);
                  return result.ok;
                };
                await asyncForEach(createNames, async (item) => {
                  await rename(response.files[item.index].id, item.name);
                });
              };
              await renameFunction(response);
            }
          }
        }
        const removeAppointment = async () => {
          try {
            await fetch(
              process.env.apiURL + "pets/" + router.query.slug + "/appointment/" + appointmentId + "/remove",
              {
                method: "delete",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: getAuthorizationHeader(),
                },
              }
            );
          } catch (error) {
            console.log("error: " + error);
          }
        };
        if (props.fromAppointment) {
          removeAppointment();
          router.push({ pathname: `/moje-zver/zvire/[slug]/zaznamy`, query: { slug: petId, id: Id } });
        }
      } else if (props.type === "edit") {
        // update record info
        const updateRecord = async () => {
          const result = await fetch(process.env.apiURL + "pets/" + petId + "/records/" + editRecord.id + "/update", {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: getAuthorizationHeader(),
            },
            body: JSON.stringify(recordObject),
          });
          const response = await result.json();
          if (response.errors) throw new Error(response.errors);
          return response.id;
        };
        const Id = await updateRecord();

        if (typeof Id === "number") {
          // delete files
          if (deleteFiles.length > 0) {
            const deleteFile = async (id) => {
              await fetch(
                process.env.apiURL + "pets/" + router.query.slug + "/records/" + editRecord.id + "/delete/" + id,
                {
                  headers: {
                    Authorization: getAuthorizationHeader(),
                  },
                  method: "DELETE",
                }
              );
            };

            await asyncForEach(deleteFiles, async (item) => {
              await deleteFile(item.id);
            });
          }
          // upload new files and rename them
          if (createFiles.length > 0) {
            props.notie.info("Vydržte, nahrávám soubory");
            var data = new FormData();
            for (var i = 0; i < createFiles.length; i++) {
              var fileData = createFiles[i];
              data.append(`file${i}`, fileData);
            }
            const fileUpload = await fetch(
              process.env.apiURL + "pets/" + router.query.slug + "/records/store/" + Id + "/files",
              {
                headers: {
                  Authorization: getAuthorizationHeader(),
                },
                method: "POST",
                body: data,
              }
            );
            const response = await fileUpload.json();
            // rename uploaded files
            if (response.status !== 200 && response.status !== 201) throw new Error(response.errors);
            if (createNames.length > 0) {
              const renameFunction = async (response) => {
                const rename = async (fileID, fileName) => {
                  const result = await fetch(
                    process.env.apiURL + "pets/" + router.query.slug + "/records/" + Id + "/file-rename/" + fileID,
                    {
                      headers: {
                        Authorization: getAuthorizationHeader(),
                      },
                      method: "PUT",
                      body: JSON.stringify({ name: fileName }),
                    }
                  );
                  if (result.errors) throw new Error(result.errors);
                  return result.ok;
                };

                await asyncForEach(createNames, async (item) => {
                  await rename(response.files[item.index].id, item.name);
                });
              };
              await renameFunction(response);
            }
          }

          // rename existing files
          if (updateNames.length > 0) {
            const renameFunction = async () => {
              const rename = async (fileID, fileName) => {
                const response = await fetch(
                  process.env.apiURL + "pets/" + router.query.slug + "/records/" + Id + "/file-rename/" + fileID,
                  {
                    headers: {
                      Authorization: getAuthorizationHeader(),
                    },
                    method: "PUT",
                    body: JSON.stringify({ name: fileName }),
                  }
                );
                if (response.errors) throw new Error(response.errors);
                return response.ok;
              };

              await asyncForEach(updateNames, async (item) => {
                await rename(item.id, item.name);
              });
            };

            await renameFunction();
          }
        }
      }

      if (props.type === "add") props.notie.success("Úspěšně vytvořeno!");
      else if (props.type === "edit") props.notie.success("Úspěšně změněno!");
      props.close(Date.now());
      hide();
    } catch (err) {
      console.log("error: " + err);
      props.notie.error("Nastala chyba při ukládání: " + err);
    }
  };
  return (
    <TransparentModal hasBackdrop={true} passClass={["modalBlack recordModal"]} title={title} hide={hide}>
      <div className="container" id="modal">
        <form id="record" onSubmit={handleSubmit(onSubmit)}>
          <div className="firstRow">
            <div className="description">
              <div className={errors.description && "error"}>
                <h3>Popis vyšetření</h3>
              </div>
              <input
                className={errors.description && "error-input"}
                name="description"
                id="description"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                defaultValue={editRecord ? editRecord?.description : description}
                ref={register({ required: true, maxLength: 191 })}
              />
            </div>
            <div className="date">
              <div className={errors.date && "error"}>
                <h3>Datum vyšetření</h3>
              </div>

              {browser.getBrowserName() === "Safari" ? (
                <SafariDate error={errors.date} setDate={setDate} date={editRecord ? editRecord?.date : date} />
              ) : (
                <input
                  type="date"
                  name="date"
                  className={errors.date ? "modal-date error-input" : "modal-date"}
                  defaultValue={editRecord ? editRecord?.date : date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    delete errors?.date;
                  }}
                  ref={register({ required: true })}
                />
              )}
            </div>
          </div>
          <div
            className={(errors.notes || notes?.length >= 500) && "error"}
            style={{ display: "flex", width: "100%", justifyContent: "space-between" }}
          >
            <h3>Poznámky</h3>
            <h3 style={notes?.length >= 500 ? { color: "#dc3c43", paddingRight: "2rem" } : { paddingRight: "2rem" }}>
              {notes ? notes.length : 0}/500
            </h3>
          </div>
          <textarea
            key="notes"
            rows={
              window.innerWidth > 576 ? (window.innerWidth > 768 ? (window.innerWidth > 992 ? "6" : "8") : "13") : "25"
            }
            className={errors.notes || notes?.length >= 500 ? "modal-date error-input" : "modal-date"}
            onChange={(e) => setNotes(e.target.value)}
            defaultValue={editRecord ? editRecord?.notes : notes}
            name="notes"
            maxLength="500"
            ref={register({ maxLength: 500 })}
            style={{ resize: "none" }}
          ></textarea>
          <h3>Soubory</h3>
          {updateFiles?.map((item, index) => (
            <div className="fileRow" key={`fileRow${item.id}`}>
              <div className="fileLabel">Uložený soubor:</div>
              <div className="imageButton input-file">
                <img src={handleSign(item.file_name)} />
                <input
                  key={`text${item.id}`}
                  name={item.file_name}
                  type="text"
                  className="text"
                  placeholder={item.file_name}
                  onChange={(e) => {
                    updateFileName(e.target.value, item.id);
                  }}
                />
              </div>
              <img className="remove" src="/icons/times-circle-light.svg" onClick={() => removeFile(item, index)} />
            </div>
          ))}
          {createFiles?.map((item, index) => (
            <div className="fileRow" key={`${item.name}${index}${item.lastModified}`}>
              <div className="fileLabel">Připravený soubor:</div>
              <div className="imageButton input-file">
                <img src={handleSign(item.name)} />
                <input
                  type="text"
                  className="text"
                  defaultValue={createNames?.filter((item) => item.index == index).map((item) => item.name)}
                  placeholder={item.name}
                  onChange={(e) => {
                    createFileName(e.target.value, index);
                  }}
                />
              </div>
              <img className="remove" src="/icons/times-circle-light.svg" onClick={() => removeFile(item, index)} />
            </div>
          ))}
        </form>
        <form className="upload" method="POST" encType="multipart/form-data">
          <div className="fileLabel">Nový soubor:</div>
          <input type="file" id="fileInput" multiple={true} onChange={(e) => addFiles(e.target.files)}></input>
          <p>Nahrát soubor z počítače</p>
          <img src="/icons/cloud-upload-alt-solid.svg"></img>
        </form>
        <div className="buttons">
          <input type="button" className="back" onClick={() => hide()} value="Zrušit"></input>
          <input
            key="submitTerm1"
            form="record"
            className="submit"
            type="submit"
            value={props.type == "edit" ? "Změnit" : "Přidat"}
            id="submit"
            onClick={() => {
              !date && (errors.date = "date required");
            }}
          ></input>
        </div>
      </div>
    </TransparentModal>
  );
};

export default withNotie(RecordsModal);
