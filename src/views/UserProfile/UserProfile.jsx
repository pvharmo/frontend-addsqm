import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
// import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Table from "components/Table/Table.jsx";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Divider from '@material-ui/core/Divider';

import {socket} from "socket";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class UserProfile extends React.Component {
  constructor() {
    super();

    this.employes = this.employes.bind(this);

    socket.emit("chercherEmployes");

    socket.on("employes", (res) => this.employes(res));
    socket.on('envoyer-infos-paies', (paies) => {
      console.log(paies);
      if (paies) {
        let table = [];
        for (var i = 0; i < paies[0].length; i++) {
          let row = Object.keys(paies[0][i]).map((key) => {
            return paies[0][i][key];
          });
          table.push(row);
        }
        this.setState({table});
      }
    });

    let employeVide = {pays: "",province: "",ville: "",adresse: "",assurance_collective_employe: "",assurance_collective_employeur: "",
      assurance_emploi: "",assurance_emploi_employe: "",assurance_emploi_employeur: "",assurance_employe: "",assurance_employeur: "",
      code_postal: "",created_at: "",fss_employe: "",fss_employeur: "",heures_travaille: "",id: undefined,impot_federal: "",
      impot_provincial: "",nom: "",numero_assurance_sociale: "",prenom: "",rqap: "",rqap_employe: "",rqap_employeur: "",
      rrq_employe: "",rrq_employeur: "",sante_quebec: "",tarif_horaire: "",updated_at: "",vie_mam_federal: "",vie_mam_provincial: ""
    }

     this.state = {
       employes: [],
       menuEmployes: undefined,
       infoPerso: false,
       montrerNAS: false,
       employeSelectionne: employeVide,
       table: undefined
     }
  }

  selectionnerEmploye(employeSelectionne) {
    this.setState({menuEmployes: null, employeSelectionne});
  }

  employes(employes) {
    this.setState({employes});
  }

  ouvrirMenuEmployes(menuEmployes, event) {
    if (menuEmployes) {
      this.setState({menuEmployes: event.currentTarget});
    } else {
      this.setState({menuEmployes: null});
    }
  }

  afficherInfoPerso() {
    if (this.state.table === undefined) {
      this.paies();
    }
    let infoPerso = this.state.infoPerso;
    this.setState({infoPerso:!infoPerso});
  }

  toggleNAS() {
    let montrerNAS = this.state.montrerNAS;
    this.setState({montrerNAS: !montrerNAS})
  }

  handleChange(event) {
    let employeSelectionne = this.state.employeSelectionne;
    employeSelectionne[event.target.id]= event.target.value;
    this.setState({employeSelectionne});
  }

  enregistrer(nouvelEmploye) {
    console.log(this.state.employeSelectionne.id);
    if (this.state.employeSelectionne.id === undefined) {
      console.log("nouveau");
      socket.emit("nouvelEmploye", this.state.employeSelectionne);
    } else {
      console.log("enregistrer");
      socket.emit("enregistrerEmploye", this.state.employeSelectionne);
    }
  }

  nouvelEmploye() {
    let employeVide = {pays: "",province: "",ville: "",adresse: "",assurance_collective_employe: "",assurance_collective_employeur: "",
      assurance_emploi: "",assurance_emploi_employe: "",assurance_emploi_employeur: "",assurance_employe: "",assurance_employeur: "",
      code_postal: "",created_at: "",fss_employe: "",fss_employeur: "",heures_travaille: "",id: undefined,impot_federal: "",
      impot_provincial: "",nom: "",numero_assurance_sociale: "",prenom: "",rqap: "",rqap_employe: "",rqap_employeur: "",
      rrq_employe: "",rrq_employeur: "",sante_quebec: "",tarif_horaire: "",updated_at: "",vie_mam_federal: "",vie_mam_provincial: ""
    };
    this.setState({employeSelectionne: employeVide, menuEmployes: null});
  }

  async paies() {
    socket.emit('get-infos-paies', this.state.employeSelectionne.id);

  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Grid container>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>

              </CardAvatar>
              <CardBody profile>
                <Button
                  id="boutton-menu-employes"
                  color="primary"
                  aria-owns={this.state.menuEmployes ? 'simple-menu': null}
                  aria-haspopup="true"
                  onClick={this.ouvrirMenuEmployes.bind(this, true)}
                  >
                  {this.state.id ? this.state.prenom + " " + this.state.nom : "Sélectionner un employé"}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.menuEmployes}
                  open={Boolean(this.state.menuEmployes)}
                  onClose={this.ouvrirMenuEmployes.bind(this, false)}
                  >
                  {this.state.employes[0] && this.state.employes[0].map((employe)=>{
                    return <MenuItem key={employe.id} onClick={this.selectionnerEmploye.bind(this, employe)}>{employe.prenom} {employe.nom}</MenuItem>
                  })}
                  <Divider />
                  <MenuItem onClick={this.nouvelEmploye.bind(this)}>Nouvel employé</MenuItem>
                </Menu>
              <Grid container>
                <GridItem xs={12} sm={6} md={6}>
                  <CustomInput
                    labelText="Prénom"
                    id="prenom"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: this.handleChange.bind(this),
                      value: this.state.employeSelectionne.prenom
                    }}
                    />
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                  <CustomInput
                    labelText="Nom"
                    id="nom"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: this.handleChange.bind(this),
                      value: this.state.employeSelectionne.nom
                    }}
                    />
                </GridItem>
                <GridItem xs={12} sm={8} md={8}>
                  <CustomInput
                    labelText="Addresse"
                    id="adresse"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: this.handleChange.bind(this),
                      value: this.state.employeSelectionne.adresse
                    }}
                    />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                  <CustomInput
                    labelText="Code postal"
                    id="code_postal"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: this.handleChange.bind(this),
                      value: this.state.employeSelectionne.code_postal
                    }}
                    />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                  <CustomInput
                    labelText="Ville"
                    id="ville"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: this.handleChange.bind(this),
                      value: this.state.employeSelectionne.ville
                    }}
                    />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                  <CustomInput
                    labelText="Province"
                    id="province"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: this.handleChange.bind(this),
                      value: this.state.employeSelectionne.province
                    }}
                    />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                  <CustomInput
                    labelText="Pays"
                    id="pays"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: this.handleChange.bind(this),
                      value: this.state.employeSelectionne.pays
                    }}
                    />
                </GridItem>
              </Grid>
              <Button color="primary" round onClick={this.enregistrer.bind(this)} >
                {this.state.employeSelectionne.id ? "Enregistrer" : "Nouvel Employé"}
              </Button>
            </CardBody>
          </Card>
        </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <Grid container>
                  <GridItem xs={12} sm={12} md={8}>
                    <h4 className={classes.cardTitleWhite}>Information de l'employé</h4>
                    <p className={classes.cardCategoryWhite}>Informations personnelles</p>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Button
                      id="boutton-menu-employes"
                      color="transparent"
                      onClick={this.afficherInfoPerso.bind(this)}
                      >
                      {this.state.infoPerso ? "Masquer" : "Afficher"}
                    </Button>
                  </GridItem>
                </Grid>
              </CardHeader>
              {this.state.infoPerso &&
              <CardBody>

                <Grid container>
                  <GridItem xs={12} sm={6} md={4}>
                    <CustomInput
                      labelText="Heures de travail"
                      id="heures_travaille"

                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.employeSelectionne.heures_travaille,
                        onChange:  this.handleChange.bind(this)
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={6} md={4}>
                    <CustomInput
                      labelText="Tarif horaire"
                      id="tarif_horaire"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.tarif_horaire
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Numéro d'assurance sociale"
                      id="numero_assurance_sociale"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        type: this.state.montrerNAS ? "text" : "password",
                        value: this.state.employeSelectionne.numero_assurance_sociale,
                        endAdornment: <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.toggleNAS.bind(this)}
                          >
                            {this.state.montrerNAS ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }}
                      />
                  </GridItem>
                </Grid>
                <Grid container>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="RRQ"
                      id="rrq_employe"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.rrq_employe
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="RQAP"
                      id="rqap_employe"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.rqap_employe
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Assurance emploi"
                      id="assurance_emploi_employe"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.assurance_emploi_employe
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Assurance collective"
                      id="assurance_collective_employe"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.assurance_collective_employe
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Impôt fédéral"
                      id="impot_federal"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.impot_federal
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Impôt provincial"
                      id="impot_provincial"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.impot_provincial
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Vie et MAM fédéral"
                      id="vie_mam_federal"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.vie_mam_federal
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Vie et MAM provincial"
                      id="vie_mam_provincial"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.vie_mam_provincial
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Sante Québec"
                      id="sante_quebec"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.sante_quebec
                      }}
                      />
                  </GridItem>
                </Grid>
                <h4>Part de l'employeur</h4>

                <Grid container>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Assurance emploi"
                      id="assurance_emploi_employeur"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.assurance_emploi_employeur
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="RQAP"
                      id="rqap_employeur"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.rqap_employeur
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="FSS"
                      id="fss_employeur"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.fss_employeur
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="RRQ"
                      id="rrq_employeur"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: this.handleChange.bind(this),
                        value: this.state.employeSelectionne.rrq_employeur
                      }}
                      />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Assurance collective"
                      id="assurance_collective_employeur"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: this.state.employeSelectionne.assurance_collective_employeur,
                        onChange: this.handleChange.bind(this)
                      }}
                      />
                  </GridItem>
                </Grid>
              </CardBody>}
            </Card>
          </GridItem>
          <GridItem >
            {this.state.infoPerso && this.state.table &&
            <Card plain>
              <CardHeader plain color="primary">
                <h4 className={classes.cardTitleWhite}>
                  Paie
                </h4>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Semaine", "Heures", "Tarif horaire", "RRQ", "Impôt prov.", "Ass. collective", "Impôt féd.", "Vie et MAM féd.", "Vie et MAM prov.", "RQAP", "Ass. emploi (E)", "Santé Québec", "Ass. collective (E)", "RRQ (E)", "FSS", "Ass. emploi", "RQAP (E)"]}
                  tableData={this.state.table}
                />
              </CardBody>
            </Card>}
          </GridItem>
      </Grid>
    </div>
  );
  }
}

export default withStyles(styles)(UserProfile);
