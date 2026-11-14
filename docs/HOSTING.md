# Hosting, costs and switching presentations

**Ask your agent to manage the technical setup and explain the plan before spending anything.** You decide the event, audience, budget and how long the site should stay online.

The agent should first try the app locally, then recommend a public setup. For this small Node/SQLite application, one dedicated Linux VM with HTTPS is a reasonable starting point. It has no runtime AI API cost. Capacity still needs to be checked for the intended class size and network.

## A micro instance and the free allowance

Google Cloud's ongoing free allowance currently includes eligible **non-preemptible e2-micro** time in `us-west1`, `us-central1` or `us-east1`, with up to **30 GB-month of standard persistent disk** and a limited outbound traffic allowance. The compute allowance is shared across eligible instances; a second VM is not automatically another free VM. A trial credit is a separate offer. Verify your account and current terms before provisioning. [Google Cloud Free Tier](https://docs.cloud.google.com/free/docs/free-cloud-features)

A publicly reachable VM can still incur networking charges. External IPv4 has separate pricing; at a listed rate of **US$0.005/hour**, 720 billed hours would be **US$3.60**, before other charges and tax. An unused reserved address may have a different rate. [Google Cloud IP address pricing](https://cloud.google.com/vpc/network-pricing#ipaddress)

Ask the agent to produce a short table for **your** planned setup:

| Item | The agent should establish |
|---|---|
| Coding agent | Plan cost, usage limits, and whether extra usage is enabled. [Model guidance](MODELS.md) |
| VM | Region, type, standard versus Spot, hours, and whether your free allowance is still available. |
| Disk | Size and disk type; a faster default disk may fall outside the relevant allowance. |
| Internet access | Address, outbound traffic, and any other network charges. |
| Domain and HTTPS | A domain you own or another usable hostname; certificate setup and any domain fee. |
| Backups | Location, storage cost, retention, and how to restore. |
| End date | Expected event cost, monthly cost if forgotten, and a shutdown reminder. |

Create a billing alert. An alert is a warning, not a hard spending cap. Do not create a load balancer, managed database or extra VM unless there is a concrete need and you have approved the cost.

## What this presentation's server cost

The original deployment used a standard e2-micro in Iowa, a 10 GB standard persistent disk and one public IPv4 address. The configuration was recorded before the server was removed. At the published USD list rates, the estimate is:

| Resource | 24-hour equivalent | 730-hour month |
|---|---:|---:|
| e2-micro at $0.008376428/hour | $0.2010 | $6.1148 |
| Public IPv4 at $0.005/hour | $0.1200 | $3.6500 |
| 10 GB standard disk at $0.04/GB-month | $0.0132 | $0.4000 |
| **Total, rounded** | **$0.33** | **$10.16** |

This is an estimate, not a retrieved invoice. It excludes tax, outbound traffic, optional services, the coding-agent subscription and any free allowance or credit. The daily disk figure prorates a 730-hour month. Other currencies use the provider's applicable prices. [Compute pricing](https://cloud.google.com/products/compute/pricing/general-purpose), [disk pricing](https://cloud.google.com/compute/disks-image-pricing), [IPv4 pricing](https://cloud.google.com/vpc/network-pricing#ipaddress)

Major cloud providers may offer introductory credits. For example, eligible Google Cloud newcomers currently receive **US$300 valid for 90 days**. Covered usage can be paid from that credit, leaving **US$0 payable for this hosting** while sufficient valid credit remains. This does not pay for an unrelated coding-agent subscription. Check eligibility, exclusions and expiry rather than assuming every account has credit. [Google Cloud trial terms](https://docs.cloud.google.com/free/docs/free-cloud-features)

## What the agent should deploy

Use a dedicated VM for the activity. The provided [bootstrap script](../deploy/bootstrap-vm.sh) targets a fresh x86-64 Debian/Ubuntu system, installs Node 24 and Caddy, and serves the app behind HTTPS. It refuses to overwrite an existing installation. It does not create cloud resources, DNS or firewall rules.

The agent should:

1. Identify the exact cloud project and new VM, with your approved estimate. Do not reuse or modify unrelated services.
2. Configure a hostname pointing to that VM, allow HTTP/HTTPS, and restrict administrative access. Keep app port 8787 internal.
3. Clone your reviewed repository onto the VM. Run `sudo bash deploy/bootstrap-vm.sh YOUR_HOSTNAME` from its folder. Replace `YOUR_HOSTNAME` with the actual DNS name; do not paste an example domain unchanged.
4. Verify HTTPS, the health endpoint, one complete game, private speaker access and the public QR from mobile data.
5. Give you the working address, controls, exact resource names, expected cost, backup procedure and shutdown date. Do not claim success merely because a command exited successfully.

The application uses a private local SQLite database. Never put its data directory or live access links in GitHub. [Security limits](../SECURITY.md)

## Save to your GitHub account

GitHub can keep the code, presentation, notes and instructions so your agent can restore or change the activity later. Ask it to create your own repository, commit the reviewed project, and verify it can be cloned. A private repository is a sensible default for unpublished teaching material.

Public repositories need a separate check for permission to share content, personal details, secrets, exported links and real student responses. Git history matters too: deleting a secret from the latest file does not remove it from earlier commits.

**GitHub is not a backup of live game sessions.** Save those separately if needed. On a VM installed with the provided script, `sudo bash deploy/backup-vm.sh` creates a private archive under `/var/backups/singularity`. Download it to a private location and verify it before removing the server. [Restore instructions](../deploy/README.md)

## Switch to another presentation

You can reuse the same small VM for a different activity, one at a time. You do not need a new cloud server for each presentation. The agent should save the old project to GitHub, privately back up any required session data, prepare and test the new version locally, then deploy the chosen version with a clean database or a compatible migration.

Replacing the title or `deck.json` alone is not enough: this example's graphics, rounds and speaker mappings also live in code. Have the agent check them together. Keep a rollback version and verify the new QR, speaker notes and results before inviting the class. Do not switch software during an active session.

After restarting a stopped VM, the public address may have changed. The agent should recheck DNS, HTTPS and the join code. [Google Cloud stop/start behaviour](https://docs.cloud.google.com/compute/docs/instances/stop-start-instance)

## After the presentation

Set a calendar reminder when you schedule the event: **save the project, verify the backup, then stop hosting**. Ask the agent to offer a reminder or shutdown schedule only when the date is known and you have approved it; do not silently shut down a future session.

Closing the browser leaves the server running. Stopping the VM stops compute charges, but retained disks, snapshots and reserved addresses may still be billed. If you no longer need the installation, ask the agent to identify and remove only its resources after checking the backup. [Google Cloud stop/start billing notes](https://docs.cloud.google.com/compute/docs/instances/stop-start-instance)

For your next class, give the agent your GitHub repository and this guide. It can help restore the application to an eligible micro instance, subject to the current allowance, or deploy a different activity to the same VM. Have it explain the cost again before proceeding.
